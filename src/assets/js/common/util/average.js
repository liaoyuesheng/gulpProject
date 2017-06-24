/**
 * 求平均数方法
 * @param array 数组
 * @returns {number} 返回平均数取整
 */
util.average = function (array) {
    var total = 0;
    for (var i in array) {
        total += array[i]
    }
    return Math.floor(total / array.length)
};
