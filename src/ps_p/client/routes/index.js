import App from '../views/App';

const routesConfig = [{
        path: '/',
        // component: NewUserTabs,
        indexRoute: {
            onEnter: (nextState, replace) => replace('/my/login'),
        }
    },
    {
        path: '/my/login/index(\.html)',
        component: App,
    },
    {
        path: '/my/login(/)',
        component: App,
        childRoutes: [{
            path: '/my/login',
            component: App,
        }]
    }
];

export default routesConfig;
