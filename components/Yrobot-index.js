const getPageComponent = (selector, ctx = getCurrentPages()[getCurrentPages().length - 1]) => {
    const componentCtx = ctx.selectComponent(selector);

    if (!componentCtx) {
        throw new Error('无法找到对应的组件');
    };

    return componentCtx;
}

export default getPageComponent;