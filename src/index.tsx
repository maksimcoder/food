import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { parseInit } from 'api/parse';

import { router } from 'router/router';

// import { store } from 'app/store';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
parseInit();

root.render(
	<React.StrictMode>
		{/* <Provider store={store}> */}
		<RouterProvider router={router} />
		{/* </Provider> */}
	</React.StrictMode>
);
