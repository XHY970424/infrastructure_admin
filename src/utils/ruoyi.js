/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

export function formatTime(date, symbol1, symbol2){
  date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(symbol1 || '-') + ' ' + [hour, minute, second].map(formatNumber).join(symbol2 || ':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 添加日期范围
export function addDateRange(params, dateRange) {
	var search = params;
	search.beginTime = "";
	search.endTime = "";
	if (null != dateRange && '' != dateRange) {
		search.beginTime = this.dateRange[0];
		search.endTime = this.dateRange[1];
	}
	return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).map((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return false;
		}
	})
	return actions.join('');
}

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  // 数据为空直接返回
  if(data == null || data.length == 0){
    return [];
  }
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || 0
	//对源数据深度克隆
	const allRes = JSON.parse(JSON.stringify(data))
	//循环所有项
	// const treeData =  cloneData.filter(father => {
	//   let branchArr = cloneData.filter(child => {
	// 	//返回每一项的子级数组
	// 	return father[id] === child[parentId]
	//   });
  //   // console.log(branchArr)
	//   branchArr.length > 0 ? father.children = branchArr : '';
	//   //返回第一层
	//   return father[parentId] === rootId;
	// });
        let result = allRes.reduce(function (prev, item) {
          prev[item[parentId]]
            ? prev[item[parentId]].push(item)
            : (prev[item[parentId]] = [item]);
          return prev;
        }, {});
        for (let prop in result) {
          result[prop].forEach(function (item, i) {
            result[item[id]] ? (item[children] = result[item[id]]) : "";
          });
        }
        // result = result[0];
        let key=Object.keys(result)
        result = result[key[0]];
        for (let i = 0; i < result.length; i++) {
          result[i].check = false;
        }
	return result != '' ? result : data;
  }

  // 验证身份证合法性
export function SFID(card) {
  var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
    21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
    33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
    42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
    51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
    63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
  };
//检查号码是否符合规范，包括长度，类型
  var isCardNo = function(card)
  {
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if(reg.test(card) === false)
    {
      return false;
    }
    return true;
  };
//取身份证前两位,校验省份
  var checkProvince = function(card)
  {
    var province = card.substr(0,2);
    if(vcity[province] == undefined)
    {
      return false;
    }
    return true;
  };
//检查生日是否正确
  var checkBirthday = function(card)
  {
    var len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if(len == '15')
    {
      var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
      var arr_data = card.match(re_fifteen);
      var year = arr_data[2];
      var month = arr_data[3];
      var day = arr_data[4];
      var birthday = new Date('19'+year+'/'+month+'/'+day);
      return verifyBirthday('19'+year,month,day,birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if(len == '18')
    {
      var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
      var arr_data = card.match(re_eighteen);
      var year = arr_data[2];
      var month = arr_data[3];
      var day = arr_data[4];
      var birthday = new Date(year+'/'+month+'/'+day);
      return verifyBirthday(year,month,day,birthday);
    }
    return false;
  };
//校验日期
  var verifyBirthday = function(year,month,day,birthday)
  {
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理
    if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
    {
      //判断年份的范围（3岁到100岁之间)
      var time = now_year - year;
      if(time >= 3 && time <= 100)
      {
        return true;
      }
      return false;
    }
    return false;
  };
//校验位的检测
  var checkParity = function(card)
  {
    //15位转18位
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if(len == '18')
    {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var cardTemp = 0, i, valnum;
      for(i = 0; i < 17; i ++)
      {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[cardTemp % 11];
      if (valnum == card.substr(17, 1))
      {
        return true;
      }
      return false;
    }
    return false;
  };
//15位转18位身份证号
  var changeFivteenToEighteen = function(card)
  {
    if(card.length == '15')
    {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var cardTemp = 0, i;
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
      for(i = 0; i < 17; i ++)
      {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      card += arrCh[cardTemp % 11];
      return card;
    }
    return card;
  };

  //是否为空
  if(card === '')
  {
    // mui.alert('请输入身份证号，身份证号不能为空');
    return false;
  }
  //校验长度，类型
  if(isCardNo(card) === false)
  {
    //  mui.alert('您输入的身份证号码不正确，请重新输入');
    return false;
  }
  //检查省份
  if(checkProvince(card) === false)
  {
    //  mui.alert('您输入的身份证号码不正确,请重新输入');
    return false;
  }
  //校验生日
  if(checkBirthday(card) === false)
  {
    //  mui.alert('您输入的身份证号码生日不正确,请重新输入');
    return false;
  }
  //检验位的检测
  if(checkParity(card) === false)
  {
    //  mui.alert('您的身份证校验位不正确,请重新输入');
    return false;
  }
//    console.info("OK");
  return true;
}

// 验证邮箱格式
export function checkEmail(email){
  var myemail=email;
  var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
  if(myReg.test(myemail)){
    return true;
  }else{
    return false;
  }
}
