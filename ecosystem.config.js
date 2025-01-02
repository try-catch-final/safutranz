module.exports = {
    apps: [
        {
            name: 'safutranz-backend',
            script: 'server/server.js',
            cwd: '/root/work/safutranz',
            instances: 1,
            exec_mode: 'fork',

            // Environment variables
            env: {
                NODE_ENV: 'development',
                PORT: 5000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000
            },

            // Logging
            log_file: '/var/log/safutranz/backend-combined.log',
            out_file: '/var/log/safutranz/backend-out.log',
            error_file: '/var/log/safutranz/backend-error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

            // Process management
            watch: false,
            ignore_watch: ['node_modules', 'logs', '.git'],
            max_memory_restart: '1G',

            // Auto restart configuration
            restart_delay: 4000,
            max_restarts: 10,
            min_uptime: '10s',

            // Advanced features
            merge_logs: true,
            autorestart: true,

            // Monitoring
            monitoring: false,
            pmx: true,

            // Source map support
            source_map_support: true,

            // Kill timeout
            kill_timeout: 5000,

            // Environment file
            env_file: '.env'
        },
        {
            name: 'safutranz-client',
            script: 'npm',
            args: 'run dev',
            cwd: '/root/work/safutranz/client',
            instances: 1,
            exec_mode: 'fork',

            // Environment variables
            env: {
                NODE_ENV: 'development',
                PORT: 4000,
                HOST: '0.0.0.0'
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 4000,
                HOST: '0.0.0.0'
            },

            // Logging
            log_file: '/var/log/safutranz/client-combined.log',
            out_file: '/var/log/safutranz/client-out.log',
            error_file: '/var/log/safutranz/client-error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

            // Process management
            watch: false,
            ignore_watch: ['node_modules', 'logs', '.git', 'build', 'dist'],
            max_memory_restart: '500M',

            // Auto restart configuration
            restart_delay: 2000,
            max_restarts: 10,
            min_uptime: '10s',

            // Advanced features
            merge_logs: true,
            autorestart: true,

            // Monitoring
            monitoring: false,
            pmx: true,

            // Kill timeout
            kill_timeout: 5000,

            // Use npm as interpreter
            interpreter: 'none'
        }
    ],

    deploy: {
        production: {
            user: 'root',
            host: 'localhost',
            ref: 'origin/master',
            repo: 'git@github.com:your-username/safutranz.git',
            path: '/root/work',
            'post-deploy': 'npm install && cd client && npm install && cd .. && pm2 reload ecosystem.config.js --env production'
        }
    }
}; 