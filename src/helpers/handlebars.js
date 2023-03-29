const Handlebars = require('handlebars');

module.exports = {
    sum: (a, b) => a + b,
    eq: (a, b) => a === b,
    ceil: (number) => Math.ceil(number),
    sortAble: (field, sort) => {
        var sortType = field === sort.column ? sort.type : 'default';
        if (!['asc', 'desc', 'default'].includes(sort.type)) {
            sortType = 'default';
        }

        const icons = {
            default: 'fa fa-arrows-v',
            desc: 'fa fa-arrow-down',
            asc: 'fa fa-arrow-up',
        };
        const icon = icons[sortType];

        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        };
        const type = types[sortType];

        const address = Handlebars.escapeExpression(
            `?_sort&column=${field}&type=${type}`,
        );

        const output = `<a href="${address}">
                <i class="${icon}" aria-hidden="true"></i>
              </a>`;
        return new Handlebars.SafeString(output);
    },
};
