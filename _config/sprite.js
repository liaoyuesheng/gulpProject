var config = [
    {
        src: 'src/assets/images/sprites/icons/*.png',
        imgName: 'sprite.png',
        cssName: '_sprite.less',
        imgPath: '../images/sprite.png',
        cssTemplate: '_config/sprite.handlebars'
    },
    {
        src: 'src/assets/images/sprites/icons2/*.png',
        imgName: 'sprite2.png',
        cssName: '_sprite2.less',
        imgPath: '../images/sprite2.png',
        cssTemplate: '_config/sprite2.handlebars'
    }
];
module.exports = config;