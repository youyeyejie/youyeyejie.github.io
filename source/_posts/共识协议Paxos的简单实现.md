---
title: 共识协议Paxos的简单实现
categories:
    - Misc
date: 2025-12-18 19:40:35
tags:
    - Paxos
    - 算法
excerpt: NIS3355 算法计算复杂度分析 课程设计：Paxos共识算法的简单实现与分析
index_img:
---

> 本文是 NIS3355 算法计算复杂度分析课程设计的实验报告，实验内容为 Paxos 共识算法的简单实现与分析。文章简要介绍了实验目标、要求、实现逻辑说明以及运行结果，旨在记录和分享 Paxos 共识算法的实现过程和心得体会。

# 实验目标
了解共识的运行过程，并动手实现共识协议 Paxos，通过协议的运行保证所有参与节点以相同的顺序对所有的请求进行提交。

# 实验要求
## 基本定义
- 节点（node）：参与共识协议过程的一个进程。
- 提议（propose）：节点提议一组数据内容，参与共识协议的过程，确定是否提交，在本实验不考虑实际的含义，选择随机的内容进行提议。
- 提交（commit）：将完成 decide 的共识实例的数据持久化存储，在本实验为记录到 log 中。

## 实现目标
- 在课程仓库中给定的 SimplePaxos 框架下，实现 Paxos 共识协议的核心逻辑。
- 节点的每个"位置"（Sequence Number）代表一次共识的结果，通过实现的共识协议，保证以下性质：
    - 无重复提交（Non-replication）：正确节点一个位置最多只有一个共识实例的结果
    - 一致性（Consistency）：所有正确节点相同的位置必须有保证相同的共识实例结果
    - 有效性（Validity）：节点提交的提议一定被某个节点提出过
    - 安全性（Safety）：节点之间提交的提议顺序一致

# 实现逻辑说明

## 添加消息字段

在 `myrpc/message.go` 中，扩展 `ConsensusMsg` 结构体以支持新的消息内容：
```go
type ConsensusMsg struct {
	// 原有字段省略
    // ...
	Seqs      []uint64
	Datas     [][]byte
	EstRounds []uint8
	Round     uint8
}
```

新增字段说明：

- `Seqs`：用于在 GATHER 消息中携带多个实例的序号。
- `Datas`：用于在 GATHER 消息中携带多个实例的数据。
- `EstRounds`：用于在 GATHER 消息中携带多个实例的估计轮次。
- `Round`：用于在 IMPOSE 消息中携带当前轮次信息。

## 新增局部状态
在 `core/core.go` 的 `Consensus` 结构体中，添加以下字段以支持 READ 阶段的状态管理：
```go
type Consensus struct {
    // 原有字段省略
    // ...
	round          uint8                // 当前轮次
	estInstance    map[uint64]*Instance // 已估计的instance
	estRound       map[uint64]uint8     // 每个instance的估计轮次
	gatherInstance map[uint64]*Instance // 收集到的instance
	gatherRound    map[uint64]uint8     // 每个instance的收集轮次
	gatherCount    uint8                // 已收集的节点数
	ackCount       map[uint64]uint8     // 每个instance的ACK计数
}
```

新增字段说明：

- `round`：当前的轮次编号，初始化为 0。
- `estInstance`：存储已估计的实例。
- `estRound`：存储每个实例的估计轮次。
- `gatherInstance`：存储从其他节点收集到的实例。
- `gatherRound`：存储每个实例的收集轮次。
- `gatherCount`：已收集的节点数，用于判断是否达到法定人数，初始化为 0。
- `ackCount`：每个实例的ACK计数，用于判断是否达到法定人数。

## 具体函数实现
### handleRead
```go
func (c *Consensus) handleRead(msg *myrpc.ConsensusMsg) {
	// Handle each READ message and send GATHER message to respond.
	senderRound := msg.Round
	if senderRound > c.round {
		c.round = senderRound
	} else if senderRound < c.round {
		// ignore old read message
		return
	}

	Seqs := make([]uint64, 0)
	Datas := make([][]byte, 0)
	EstRounds := make([]uint8, 0)
	for seq, instance := range c.estInstance {
		if seq < msg.Seq {
			continue
		}
		Seqs = append(Seqs, seq)
		Datas = append(Datas, instance.Data)
		EstRounds = append(EstRounds, c.estRound[seq])
	}
	gather_msg := &myrpc.ConsensusMsg{
		Type:      myrpc.GATHER,
		Proposer:  msg.Proposer,
		Sender:    c.id,
		Seq:       msg.Seq,
		Seqs:      Seqs,
		Datas:     Datas,
		EstRounds: EstRounds,
		Round:     c.round,
	}
	c.sendMessage(gather_msg, int(msg.Sender))
}
```

- 作用：响应其他节点的 READ 请求，发送 GATHER 消息以传递已估计的实例。
- 做法：
    - 比较消息中的轮次 `Round`，更新本地轮次 `round`；
    - 遍历 `estInstance`，收集所有已估计实例的 `Seq/Data/EstRound`；
    - 构造 GATHER 消息并发送给请求节点。

### handleGather
```go
func (c *Consensus) handleGather(msg *myrpc.ConsensusMsg) {
	// Handle each GATHER message to learn previous estimated values.
	// After learning each value, impose it.
	senderRound := msg.Round
	if senderRound > c.round {
		c.round = senderRound
	} else if senderRound < c.round {
		// ignore old gather message
		return
	}

	for i, seq := range msg.Seqs {
		data := msg.Datas[i]
		estRound := msg.EstRounds[i]
		if existingRound, ok := c.gatherRound[seq]; !ok || estRound > existingRound {
			c.gatherInstance[seq] = &Instance{
				Seq:  seq,
				Data: data,
			}
			c.gatherRound[seq] = estRound
		}
		if seq >= c.seq {
			c.seq = seq + 1
		}
	}
	c.gatherCount++
	if c.gatherCount >= c.n-c.f {
		for seq, instance := range c.gatherInstance {
			impose_msg := &myrpc.ConsensusMsg{
				Type:     myrpc.IMPOSE,
				Proposer: c.leader,
				Sender:   c.id,
				Seq:      seq,
				Data:     instance.Data,
				Round:    c.round,
			}
			c.broadcastMessage(impose_msg)
		}
		// reset gather variables
		c.gatherInstance = make(map[uint64]*Instance)
		c.gatherRound = make(map[uint64]uint8)
		c.gatherCount = 0
		// signal read end
		c.readEndChan <- struct{}{}
	}
}
```

- 作用：在接收到 GATHER 消息时，学习对方已决定的实例，并在收集到足够多的节点后广播 IMPOSE。
- 做法：
    - 比较消息中的轮次 `Round`，更新本地轮次 `round`；
    - 遍历消息中的实例，更新 `gatherInstance` 和 `gatherRound`；
    - 统计收到的 GATHER 消息数，当达到法定人数时，广播 IMPOSE 消息，并重置收集状态，发送 `readEndChan` 信号表示 READ 阶段结束。

### handleImpose
```go
func (c *Consensus) handleImpose(msg *myrpc.ConsensusMsg) {
	// Handle each IMPOSE message and send ACK message to respond.
	senderRound := msg.Round
	if senderRound > c.round {
		c.round = senderRound
	} else if senderRound < c.round {
		// ignore old impose message
		return
	}

	c.estInstance[msg.Seq] = &Instance{
		Seq:  msg.Seq,
		Data: msg.Data,
	}
	c.estRound[msg.Seq] = c.round

	ack_msg := &myrpc.ConsensusMsg{
		Type:     myrpc.ACK,
		Proposer: msg.Proposer,
		Sender:   c.id,
		Seq:      msg.Seq,
		Data:     msg.Data,
		Round:    c.round,
	}
	c.sendMessage(ack_msg, int(msg.Sender))
}
```

- 作用：在接收到 IMPOSE 消息时，更新已估计实例，并发送 ACK 消息以确认。
- 做法：
    - 比较消息中的轮次 `Round`，更新本地轮次 `round`；
    - 更新 `estInstance` 和 `estRound`；
    - 构造 ACK 消息并发送给 IMPOSE 发送者。

### handleAck
```go
func (c *Consensus) handleAck(msg *myrpc.ConsensusMsg) {
	// Handle each ACK message and broadcast decide message.
	senderRound := msg.Round
	if senderRound > c.round {
		c.round = senderRound
	} else if senderRound < c.round {
		// ignore old ack message
		return
	}

	c.ackCount[msg.Seq]++
	if c.ackCount[msg.Seq] >= c.n-c.f {
		decide_msg := &myrpc.ConsensusMsg{
			Type:     myrpc.DECIDE,
			Proposer: msg.Proposer,
			Sender:   c.id,
			Seq:      msg.Seq,
			Data:     msg.Data,
			Round:    c.round,
		}
		c.broadcastMessage(decide_msg)
		delete(c.ackCount, msg.Seq)
	}
}
```

- 作用：在接收到 ACK 时，统计 ACK 数量，当达到法定人数时广播 DECIDE 消息。
- 做法：
    - 比较消息中的轮次 `Round`，更新本地轮次 `round`；
    - 增加对应实例的 ACK 计数；
    - 当 ACK 数量达到法定人数时，构造 DECIDE 消息并广播，删除对应实例的 ACK 计数。

### proposeLoop 补全
```go
func (c *Consensus) proposeLoop() {
	// if new leader, read all previous instances and impose them.
	// ----- start your code here -----
	if c.round == 0 {
		c.round = c.id
	} else {
		c.round += c.n
	}
	c.logger.DPrintf("Node %v become leader at seq %v round %v", c.id, c.seq, c.round)
	// 如果有已提交的instance，则seq更新为下一个未提交的
	for c.instances[c.seq] != nil {
		c.seq++
	}
	read_msg := &myrpc.ConsensusMsg{
		Type:     myrpc.READ,
		Proposer: c.leader,
		Sender:   c.id,
		Seq:      c.seq,
		Round:    c.round,
	}
	c.broadcastMessage(read_msg)
	// ----- end your code here -----
	<-c.readEndChan
	c.logger.DPrintf("Node %v finish reading at seq %v round %v", c.id, c.seq, c.round)


    // 原有代码省略
    // ...
}
```
- 作用：在成为新 leader 后，广播 READ 消息以收集先前实例。
- 做法：
    - 更新轮次 `round`；
    - 构造 READ 消息并广播；
    - 等待 `readEndChan` 信号，表示 READ 阶段结束。

## 运行结果
```bash
cd scripts
./run_nodes.sh 10 100 50
python3 check.py 5
# Output:
    ----------begin to check------------
    node 0 commits 300 times
    node 1 commits 400 times
    node 2 commits 500 times
    node 3 commits 500 times
    node 4 commits 500 times
    ---------- check validity ------------
    pass
    ---------- check safety --------------
    pass
    ---------- end -----------------------
```

# 实验总结
通过本次实验，我深入理解了 Paxos 共识算法的工作原理和实现细节。在实现过程中，遇到了消息同步和状态管理的挑战，但通过仔细分析协议流程，成功克服了这些困难。最终实现的 SimplePaxos 框架能够正确处理节点间的共识请求，保证了无重复提交、一致性、有效性和安全性等关键性质。此次实验不仅提升了我的编程能力，也加深了我对分布式系统中共识机制的理解，为未来的学习和研究打下了坚实的基础。