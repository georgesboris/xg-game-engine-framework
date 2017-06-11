const flow = require('lodash/flow');
const utils = require('./utils');

const defaultState = { __internal__: {} };
const defaultStatePool = [defaultState];
const defaultData = {
  modules: [],
  enhancers: [],
  initialState: defaultState,
  initialStatePool: defaultStatePool,
  poolSize: 3
};

function loop(data) {
  
  const nextState = flow(data.modules)({
    state: data.state,
    statePool: data.statePool
  });

  const nextData = {
    modules: data.modules,
    state: nextState,
    statePool: data.statePool.concat(nextState).slice(0, data.poolSize)
  };

  if (!nextData.state.__internal__.stop) {
    requestAnimationFrame(() => loop(nextData));
  }

}

function internal(userData) {

  const data = {
    ...dataConfig,
    ...userData
  };

  loop(
    flow([
      utils.flattenModules,
      utils.applyEnhancers(data.enhancers),
      utils.mapModuleReducers
    ])(data)
  );

}

module.exports = internal;
