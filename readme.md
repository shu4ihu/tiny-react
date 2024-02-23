## 1 JSX转换

### 1.1 什么是 JSX

JSX 是 JavaScript 的一种语法扩展，允许开发者在 JavaScript 文件中编写类似 HTML 的代码。

### 1.2 什么是 JSX 转换

包括两部分：

- 编译时：由 babel 实现
- 运行时（dev、prod 双环境）：实现 jsx 方法或 React.createElement 方法

运行时主要任务：

- [x] jsx方法
- [x] 实现打包流程
- [x] 实现调试打包结果的环境

### 1.3 实现 JSX 转换

#### 1.3.1 jsx 方法

由于 babel 实现了编译时的 JSX 转换，所以只需要将 babel 的输出，构造成一个 React 元素就可以。

1. `jsx` 函数

- jsx 接收 `type` 、`config` 和 `maybeChildren` 作为参数
- 遍历 `config` 对象的属性，并将其中的 `key` 和 `ref` 属性分别保存起来
- 根据`maybeChildren`的长度将子元素添加到 `props` 的 `children` 中，如果还有其他的属性就在 `props` 中保存起来

2. `jsxDEV` 函数

- 与 `jsx` 函数不同，`jsxDEV` 不接受 `maybeChildren` 作为参数
- 其他与 `jsx` 基本类似

#### 1.3.2 打包流程

主要是 rollup 的配置项和插件的使用

用到的都是比较基础的配置项，像 `input` 、`output` 、`plugins` 这种

同时使用了部分插件：

- rollup-plugin-typescript2
  - 可将 `.ts` `.tsx` 文件转换为 `.js` 文件
- @rollup/plugin-commonjs
  - rollup 官方提供的插件，可将 CommonJS 模块转换成 ES6 模块
- rollup-plugin-generate-package-json
  - 用于在最终输出的 dist 目录下生成 package.json 文件

#### 1.3.3 实现调试打包结果的环境

通过 `pnpm link xxx --global` 将当前的项目链接到全局环境下，使其他项目能共享当前项目

## 2 Reconciler

### 2.1 Reconciler 的工作方式

对于同一个节点，比较其 `ReactElement` 和 `fiberNode` ，生成子 fiberNode ，并根据比较结果生成不同的标记（插入、删除、移动......），
不同的标记又对应不同宿主环境（浏览器环境） API 的执行

![Reconciler工作方式](./imgs/reconciler/reconciler-1.png 'Reconciler工作方式')

挂载 `<div></div>` ：

1. jsx 经过编译时的 babel 和运行时的 jsx方法转译成 `type` 为 `div` 的 `React Element`
2. 当前的 `React Element` 会跟对应的 `fiberNode` 比较，但是当前对应 `fiberNode` 为 `null`
3. 比较的结果会生成一个子 `fiberNode` ，同时也会生成 `Placement` 标记
4. `Placement` 对应插入操作，所以宿主环境 API 就会插入一个 `div` 元素到 `DOM` 中

将 `<div></div>` 更新为 `<p></p>` ：

1. jsx 经过 babel 和 jsx 方法转译成 `type` 为 `p` 的 `React Element`
2. 当前的 `React Element` 会跟对应的 `fiberNode {type:'div'}` 比较
3. 比较的结果会生成一个子 `fiberNode` ，同时会生成 `Deletion` 和 `Placement` 标记
4. 宿主环境 API 就会先执行删除操作，将 `div` 元素删除，然后再执行插入操作，将 `p` 元素插入到 `DOM` 中

当所有 React Element 比较完之后，会生成一个 fiberNode 树，一共会存在两个 fiberNode 树：

- current ：与视图中真实 UI 对应的 fiberNode 树
- workInProgress ：触发更新之后，在 reconciler 中计算的 fiberNode 树

在 React 更新的过程中，current 树 和 WIP 树通过交替使用来实现更新。
当 React 开始处理更新时，在 WIP 树进行更新和变更的计算，确定该次更新的 WIP树的结构之后，WIP 树会与 current 树进行比较，最终确定需要更新的部分，调用宿主环境 API 将需要更新的部分更新到 DOM 中。

更新完成之后，WIP 树由于拥有最新的虚拟 DOM 结构，WIP 树会成为新的 current 树，而之前的 current 树则会成为下一次更新的 WIP 树。

这种来回更新的技术就是双缓存技术

### 2.2 JSX 消费的顺序

JSX 消费的顺序，就是以 DFS 顺序遍历 JSX。

```jsx
<Card>
	<h1>hello</h1>
	<p>react-demo</p>
</Card>
```

上述 `Card` 组件的消费顺序：
![JSX 消费顺序](./imgs/reconciler/reconciler-2.png 'JSX 消费顺序')
