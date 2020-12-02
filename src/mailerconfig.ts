import { HandlebarsAdapter } from '@nest-modules/mailer';

export = {
    transport: `smtp://admin123:admin456@localhost:2500`,
    defaults: {
        from: 'admin@test.example.com',
    },
    template: {
        dir: './templates/email',
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true,
        },
    }
};
