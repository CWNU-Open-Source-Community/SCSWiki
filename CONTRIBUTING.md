# 贡献指南

感谢参与 SCSWiki。请先确认你的贡献不会公开个人隐私、内部系统信息或未经授权的版权材料。

## 不熟悉 Git 的贡献方式

你可以通过 GitHub Issue Forms 提交：

- 内容错误反馈。
- 内容过期反馈。
- 新内容建议。

请提供页面 URL、问题描述、建议修改和可公开访问的来源材料。不要填写手机号、学号、身份证号、群号、内部系统链接或个人联系方式。

## 熟悉 Git 的贡献方式

1. Fork 仓库。
2. 创建描述清晰的分支，例如 `docs/update-trust-guide`。
3. 修改内容并运行 `pnpm check`。
4. 提交 Pull Request，并填写 PR 模板。

## 提交建议

- 文档：`docs: update content guide`
- 工程：`build: add link checker`
- 修复：`fix: correct broken link`

## Front Matter

普通内容页必须填写统一 Front Matter：

```yaml
---
title: 页面标题
description: 页面说明
category: study
audience:
  - 本科生
content_type: experience
status: needs-review
maintainers:
  - SCSWiki 维护组
sources: []
---
```

## 引用来源

外部来源应写入 `sources`：

```yaml
sources:
  - name: 来源名称
    url: https://example.com/source
```

政策、流程、培养方案、奖助、考试等高风险内容应优先引用公开正式来源。没有来源时，只能提交待核验模板。

## 活动与竞赛中心

活动中心位于 `/events/`，每个活动在 `docs/events/` 下使用独立 Markdown 详情页。普通 Front Matter 之外增加 `event` 字段，列表在构建时自动读取这些字段；不要另建一份卡片数据。

```yaml
event:
  kind: 开源活动 # 开源活动 / 学科竞赛 / 社区共建
  eyebrow: 活动封面标题
  cover: code # summer / code / fest / blue / ladder / wiki
  tags: [Git, 项目实践]
  beginner: false # 本站入门建议，不代表官方资格
  schedule: 当届时间待核实
  checked: '2026-09-12' # 资料核查日期
  official: https://example.com/
  order: 10
```

正文包含活动简介、参与入口、时间说明、准备建议和公开来源，并在标题后放置 `<EventDetails />`。`official` 必须同时出现在页面的 `sources` 中。目录和侧边栏自动读取详情页 Front Matter，无需手动添加重复的导航数据。

只对有来源的时间填写 `registrationOpen`、`registrationClose`、`start`、`end`，格式为含时区的 ISO 8601 时间，例如 `'2026-10-01T09:00:00+08:00'`。开放报名必须同时提供截止时间。未核验的届次使用 `status: needs-review`，不推测截止日期。长期贡献入口可填写 `ongoing: true`；手动归档用 `archived: true`。

状态按报名窗口、活动周期和当前时间计算。到达 `end` 的活动自动进入历史归档；报名截止但未开始的活动仍在目录中，标注“报名已截止”。有开始时间但没有结束时间时，不自动推断“进行中”。年度活动若含延长周期，应在正文解释，不能让“进行中”被误解为可报名。页面打开后每分钟刷新时间状态，无需后台服务。

封面由站内 CSS 图形与文字生成，不需要复制第三方海报。字段校验、状态边界和真实活动来源一致性已纳入 `pnpm check`。活动建议可通过 `.github/ISSUE_TEMPLATE/event.yml` 提交。

## 本地检查

```bash
pnpm install
pnpm check
pnpm build
```

不要通过关闭规则、删除测试或忽略错误来让检查通过。

### 活动名称、别名与收录范围

活动详情的 `title` 使用可核验的完整名称，`event.eyebrow` 可使用封面简称，`event.aliases` 保存常见缩写或历史名称。更名须在正文说明对应届次并附来源；不要把旧名称直接覆盖为没有出处的新名称。目录、详情和侧边栏均从详情页 Front Matter 生成。

`event.topic` 表示主要实践方向，用于筛选。优先复用已有方向：程序设计、软件开发、综合计算机、人工智能与数据、网络安全、系统开发、数学建模、机器人与硬件、创新创业、开源实践。

`event.scope: series` 表示常设赛事或活动入口，状态为“查看当届通知”，不可附带 `ongoing`、`archived` 或具体起止时间。`event.scope: edition` 表示具体活动，可按来源填写已核验时间。仅有日期但没有时刻的通知可以写入 `schedule` 和正文，不补写不存在的精确截止时间。

父赛事、子赛项、不同地区和届次不应重复充当独立机会以增加目录数量。来源访问受限时保留明确的待核验说明，研究依据见 [活动收录研究](docs/events/research.md)。
