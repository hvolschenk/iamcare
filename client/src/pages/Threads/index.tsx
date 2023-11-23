import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { thread, threadCreate, threads, urlRelative } from '~/src/urls';

import ThreadCreate from './Create/async';
import Thread from './Thread/async';
import ThreadsList from './Threads/async';

const Threads: React.FC = () => (
  <Routes>
    <Route element={<ThreadsList />} index />
    <Route element={<Thread />} path={urlRelative(thread(), threads())} />
    <Route
      element={<ThreadCreate />}
      path={urlRelative(threadCreate(), threads())}
    />
  </Routes>
);

export default Threads;
