# 开发提纲

### 目标
对于煎蛋网段子的监控、爬取、存储和展示

### 技术点
- es6的开发环境搭建 (v0.1 coverd)
- 爬虫的并发控制 (v0.1 coverd)
- 基于rabbitmq的多爬虫联动 (v0.2 coverd)
- logging完善
- pm2定时运行

### 监控方案
- 全站段子爬虫爬完全部段子（单次运行）(v0.1)
- 全站吐槽爬虫8爬完全部吐槽（单次运行）(v0.2)
- 监控爬虫监控最近10页的变化 (合理的间隔时间 间断运行)
- 监控吐槽爬虫监控最近10页段子的吐槽以及xxoo情况

### 开发计划
- 第一阶段：全站段子的单次爬取
- 第二阶段：完成后端服务器和前端展示部分
- 第三阶段：有效的新段子和监控
- 第四阶段：拓展支持reddit英文段子
- 第五阶段：to be continued

### 知乎专栏
https://zhuanlan.zhihu.com/crawler-to-all
