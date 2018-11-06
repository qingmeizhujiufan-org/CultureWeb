/* created by zhongzheng 2018.7.10 */

import assign from 'lodash/assign';

/**
 * @param 使用js让数字的千分位用,分隔
 */
export function shiftThousands(val) {
    if (typeof val !== "number") {
        return null;
    }
    ;
    return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');//使用正则替换，每隔三个数加一个','
}

/**
 * @param 显示特定日期形式
 */
export function shiftDate(dateStr) {
    if (typeof  dateStr !== 'string') return null;
    const now = new Date().getTime();
    const date = new Date(dateStr).getTime();
    const diffMillisecond = now - date;
    const second = 1000;
    const minute = 1000 * 60;
    const hour = 1000 * 60 * 60;
    const day = 1000 * 60 * 60 * 24;
    const month = 1000 * 60 * 60 * 24 * 30;
    if (diffMillisecond <= second) return '刚刚';
    else if (diffMillisecond < 3 * second) return '1秒前';
    else if (diffMillisecond < 5 * second) return '3秒前';
    else if (diffMillisecond < 10 * second) return '5秒前';
    else if (diffMillisecond < 30 * second) return '10秒前';
    else if (diffMillisecond < 60 * second) return '30秒前';
    else if (diffMillisecond < 3 * minute) return '1分钟前';
    else if (diffMillisecond < 5 * minute) return '3分钟前';
    else if (diffMillisecond < 10 * minute) return '5分钟前';
    else if (diffMillisecond < 30 * minute) return '10分钟前';
    else if (diffMillisecond < 60 * minute) return '30分钟前';
    else if (diffMillisecond < 2 * hour) return '1小时前';
    else if (diffMillisecond < 3 * hour) return '2小时前';
    else if (diffMillisecond < 4 * hour) return '3小时前';
    else if (diffMillisecond < 5 * hour) return '4小时前';
    else if (diffMillisecond < 6 * hour) return '5小时前';
    else if (diffMillisecond < 7 * hour) return '6小时前';
    else if (diffMillisecond < 8 * hour) return '7小时前';
    else if (diffMillisecond < 9 * hour) return '8小时前';
    else if (diffMillisecond < 10 * hour) return '9小时前';
    else if (diffMillisecond < 11 * hour) return '10小时前';
    else if (diffMillisecond < 12 * hour) return '11小时前';
    else if (diffMillisecond < 13 * hour) return '12小时前';
    else if (diffMillisecond < 14 * hour) return '13小时前';
    else if (diffMillisecond < 15 * hour) return '14小时前';
    else if (diffMillisecond < 16 * hour) return '15小时前';
    else if (diffMillisecond < 17 * hour) return '16小时前';
    else if (diffMillisecond < 18 * hour) return '17小时前';
    else if (diffMillisecond < 19 * hour) return '18小时前';
    else if (diffMillisecond < 20 * hour) return '19小时前';
    else if (diffMillisecond < 21 * hour) return '20小时前';
    else if (diffMillisecond < 22 * hour) return '21小时前';
    else if (diffMillisecond < 23 * hour) return '22小时前';
    else if (diffMillisecond < 24 * hour) return '23小时前';
    else if (diffMillisecond < 3 * day) return '1天前';
    else if (diffMillisecond < 7 * day) return '3天前';
    else if (diffMillisecond < 15 * day) return '1周前';
    else if (diffMillisecond < 30 * day) return '半个月前';
    else if (diffMillisecond < 3 * month) return '1个月前';
    else if (diffMillisecond < 6 * month) return '3个月前';
    else if (diffMillisecond < 12 * month) return '半年前';
    else return '一年前';
}

/**
 * @param list 转 tree
 */
export function listToTree(list) {
    if (list.length === 0) return [];
    const _list = [];
    list.map(item => _list.push(assign({}, item)));
    let arr = [];
    //首先状态顶层节点
    _list.map(item => {
        if (!item.pId) {
            arr.push(item);
        }
    });
    let toDo = [];
    arr.map(item => {
        toDo.push(item);
    });
    while (toDo.length) {
        let node = toDo.shift();
        for (let i = 0; i < _list.length; i++) {
            let row = _list[i];
            if (node.id === row.pId) {
                if (node.children) {
                    node.children.push(row);
                } else {
                    node.children = [row];
                }
                toDo.push(row);
            }
        }
    }

    function sortNumber(a, b) {
        return new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
    }

    arr.sort(sortNumber);

    return arr;
}

/**
 * @param 时间格式化  eg：2018-08-04 14:48:01
 */
export function reverseToDate(time) {
    if (typeof  time !== 'number') return null;
    let curDate = new Date(time);
    let year = curDate.getFullYear();
    let month = ((curDate.getMonth() + 1) < 10 ? '0' + (curDate.getMonth() + 1) : (curDate.getMonth() + 1));
    let day = (curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate());
    let hour = (curDate.getHours() < 10 ? '0' + curDate.getHours() : curDate.getHours());
    let minutes = (curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes());
    let second = (curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds());

    return year + '-' + month +'-'+ day +' '+ hour + ':' + minutes + ':' + second;
}
