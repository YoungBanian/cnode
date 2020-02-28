import AppState from './app-state'
import TopicState from './topic-store'

export { AppState, TopicState }

export default {
  AppState,
  TopicState,
}

export const createStoreMap = () => ({
  appState: new AppState(),
  topicStore: new TopicState(),
})
