/**
 * 随机数方法
 * @param interval 字符串，格式: [8,100)
 */
util.random = function (interval) {
    var start = interval.slice(0, 1);
    var end = interval.slice(-1);
    var minmax = interval.slice(1, -1).split(',');
    var min = parseInt(minmax[0]);
    var max = parseInt(minmax[1]);
    return Math.floor(Math.random() * (max - min) + min);
};
