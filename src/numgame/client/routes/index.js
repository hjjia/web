import App from '../views/App';

const routesConfig = [{
        path: '/',
        // component: NewUserTabs,
        indexRoute: {
            onEnter: (nextState, replace) => replace('/my/numgame'),
        }
    },
    {
        path: '/my/numgame/index(\.html)',
        component: App,
    },
    {
        path: '/my/numgame(/)',
        component: App,
        childRoutes: [{
            path: '/my/numgame',
            component: App,
        }]
    }
];

export default routesConfig;
