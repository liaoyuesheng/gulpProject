
/* 工具 */
var utils = {
    /**
     * 随机数方法
     * @param interval 字符串，格式: [8,100)
     */
    randomNumber: function (interval) {
        var start = interval.slice(0, 1);
        var end = interval.slice(-1);
        var minmax = interval.slice(1, -1).split(',');
        var min = parseInt(minmax[0]);
        var max = parseInt(minmax[1]);
        return Math.floor(Math.random() * (max - min) + min);
    },
    /**
     * 求平均数方法
     * @param array 数组
     * @returns {number} 返回平均数取整
     */
    average: function (array) {
        var total = 0;
        for (var i in array) {
            total += array[i]
        }
        return Math.floor(total / array.length)
    }
};
