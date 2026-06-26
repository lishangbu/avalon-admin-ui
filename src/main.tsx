import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import 'antd/dist/reset.css';
import './styles/global.css';

// React 入口只负责挂载根组件；所有业务级 Provider 放在 app 层，避免入口文件变复杂。
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
