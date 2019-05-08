import React from 'react';
import { Badge, Tag } from 'hzero-ui';
import { isUndefined, isNil } from 'lodash';
import Big from 'big.js';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from './intl';
import { getDateFormat, getDateTimeFormat, getTimeFormat, getTimeZone } from './utils';
import { DEFAULT_TIME_FORMAT } from './constants';

const statusMap = ['error', 'success'];
const statusCodeMap = {
  S: 'success',
  F: 'error',
  P: 'default',
  RUNING: 'processing',
  PENDING: 'default',
  COMPLETE: 'success',
  ERROR: 'error',
  RUNNING: 'processing',
  NEW: 'default',
  PART: 'processing',
  SUCCESS: 'success',
  UNEXECUTE: 'default',
  FAILED: 'error',
};

/**
 Success
 Error
 Default
 Processing
 Warning
 */

/**
 * 返回 启用/禁用 对应的多语言 并加上状态
 * @param {0|1} v 启用状态
 * return 1 ? enable(多语言) : disabled(多语言)
 */
export function enableRender(v) {
  return (
    <Badge
      status={statusMap[v]}
      text={
        v === 1 ? intl.get('hzero.common.status.enable') : intl.get('hzero.common.status.disable')
      }
    />
  );
}

/**
 * 监控状态
 * @param {1|-1|any} flag
 * @return 1 -> 正常, -1 -> 故障, other -> 未在监控
 */
export function enableFlag(flag) {
  return flag === 1 ? (
    <span style={{ color: 'rgb(102, 205, 0)' }}>
      {intl.get('hzero.common.status.normal').d('正常')}
    </span>
  ) : flag === -1 ? (
    <span style={{ color: 'rgb(240, 65, 52)' }}>
      {intl.get('hzero.common.status.abnormal').d('故障')}
    </span>
  ) : (
    <span style={{ color: 'rgb(205, 133, 63)' }}>
      {intl.get('hzero.common.status.unmonitor').d('未在监控')}
    </span>
  );
}

/**
 * 返回 是/否 多语言 并加上对应的状态
 * @param {1|any} v 值
 * @return 1 -> yes(多语言), other -> no(多语言)
 */
export function yesOrNoRender(v) {
  return (
    <Badge
      status={statusMap[v]}
      text={v === 1 ? intl.get('hzero.common.status.yes') : intl.get('hzero.common.status.no')}
    />
  );
}

/**
 * 渲染分页数据中的信息
 * @param {number} total - 数据总数
 * @param {number[]} range - [当前数据的第一条数据序号, 当前数据最后一条数据序号]
 */
export function totalRender(total, range) {
  return intl.get('hzero.common.pagination.total', {
    range1: range[0],
    range2: range[1],
    total,
  });
}

/**
 * 返回 同步/异步 多语言
 * @param {1|any} v
 * @return 1 -> sync(多语言), other -> async(多语言)
 */
export function asyncRender(v) {
  return v === 1 ? intl.get('hzero.common.status.sync') : intl.get('hzero.common.status.async');
}

/**
 * 状态渲染
 * @param {string} v - 状态编码
 * @param {string} m - 状态描述
 * @returns ReactNode
 */
export function statusRender(v, m) {
  return <Badge status={statusCodeMap[v]} text={m || v} />;
}

/**
 * 优先级渲染(低中高)
 * @param {number} [v = 0] - 优先级数值
 * @returns ReactNode
 */
export function priorityRender(v = 0) {
  return v < 35 ? (
    <span style={{ display: 'inline-block', width: '65%', background: '#52c41a' }}>
      {intl.get('hzero.common.priority.low').d('低')}
    </span>
  ) : v > 65 ? (
    <span style={{ display: 'inline-block', width: '65%', background: '#f5222d' }}>
      {intl.get('hzero.common.priority.high').d('高')}
    </span>
  ) : (
    <span style={{ display: 'inline-block', width: '65%', background: '#faad14' }}>
      {intl.get('hzero.common.priority.medium').d('中')}
    </span>
  );
}

/**
 * todo 到底需不需要这个.
 * 在dataList中返回code对应的meaning或name
 * 若不找不到，则返回code
 */
export function valueMapMeaning(dataList, code) {
  const target = dataList.find(item => item.value === code || item.code === code);
  return isUndefined(target) ? code : target.meaning || target.name;
}

/**
 * 流程状态
 */
export function processStatusRender(record) {
  return record.endTime ? (
    <Tag>{intl.get('hzero.common.status.finished').d('已结束')}</Tag>
  ) : record.suspended ? (
    <Tag color="orange">{intl.get('hzero.common.status.suspended').d('挂起中')}</Tag>
  ) : (
    <Tag color="green">{intl.get('hzero.common.status.running').d('运行中')}</Tag>
  );
}

// // 数据范围
// export function scopeRender(v) {
//   return v === 1
//     ? intl.get('hzero.common.scope.global').d('全局')
//     : intl.get('hzero.common.scope.org').d('当前组织');
// }

/**
 * 流程的已读未读状态
 * @param {'Y'|'N'} v
 * @return 'Y' || 1 -> read, 'N' || 0 -> unread, other -> ''
 */
export function readFlagRender(v) {
  return v === 'Y' || v === 1
    ? intl.get('hzero.common.status.read').d('已读')
    : v === 'N' || v === 0
    ? intl.get('hzero.common.status.unread').d('未读')
    : '';
}

/**
 * 日期(date)的 render
 * @param {?String} dateStr - 日期的字符串
 */
export function dateRender(dateStr) {
  const dateTemplate = getDateFormat();
  return dateStr && moment(dateStr, DEFAULT_DATE_FORMAT).format(dateTemplate);
}

/**
 * 时间(dateTime)的 render
 * @export
 * @param {?String} dateTimeStr - 时间日期的字符串
 * @returns
 */
export function dateTimeRender(dateTimeStr) {
  const dateTimeTemplate = getDateTimeFormat();
  return dateTimeStr && moment(dateTimeStr, DEFAULT_DATETIME_FORMAT).format(dateTimeTemplate);
}

/**
 * 时间(time)的 render
 * @param {?String} timeStr - 时间日期的字符串
 */
export function timeRender(timeStr) {
  const timeTemplate = getTimeFormat();
  return timeStr && moment(timeStr, DEFAULT_DATETIME_FORMAT).format(timeTemplate);
}

/* 时区 对应的 moment.utcOffset */
export const timeZone2MomentUTC = {
  'GMT-12': -12,
  'GMT-11': -11,
  'GMT-10': -10,
  'GMT-9': -9,
  'GMT-8': -8,
  'GMT-7': -7,
  'GMT-6': -6,
  'GMT-5': -5,
  'GMT-4': -4,
  'GMT-3': -3,
  'GMT-2': -2,
  'GMT-1': -1,
  GMT: 0,
  'GMT+1': 1,
  'GMT+2': 2,
  'GMT+3': 3,
  'GMT+4': 4,
  'GMT+5': 5,
  'GMT+6': 6,
  'GMT+7': 7,
  'GMT+8': 8,
  'GMT+9': 9,
  'GMT+10': 10,
  'GMT+11': 11,
  'GMT+12': 12,
};

// /**
//  * 依据时区格式化日期
//  * @param {moment|string} date
//  * @returns {?string}
//  */
// export function dateRenderWithUTC(date) {
//   if (!isNil(date)) {
//     const momentDate = moment(date, DEFAULT_DATE_FORMAT);
//     if (momentDate.isValid()) {
//       const timeZone = getTimeZone();
//       const utc = timeZone2MomentUTC[timeZone] || 8;
//       const utcMoment = momentDate.utcOffset(utc);
//       if (utcMoment.isValid()) {
//         const dateFormat = getDateFormat();
//         return utcMoment.format(dateFormat);
//       }
//     }
//   }
// }

/**
 * 依据时区格式化时间
 * @param {moment|string} time
 * @returns {?string}
 */
export function timeRenderWithUTC(time) {
  if (!isNil(time)) {
    const momentDate = moment(time, DEFAULT_TIME_FORMAT);
    if (momentDate.isValid()) {
      const timeZone = getTimeZone();
      const utc = timeZone2MomentUTC[timeZone] || 8;
      const utcMoment = momentDate.utcOffset(utc);
      if (utcMoment.isValid()) {
        const timeFormat = getTimeFormat();
        return utcMoment.format(timeFormat);
      }
    }
  }
}

// /**
//  * 依据时区格式化 时间（带日期）
//  * @param {moment|string} dateTime
//  * @returns {?string}
//  */
// export function dateTimeRenderWithUTC(dateTime) {
//   if (isNil(dateTime)) {
//     const momentDate = moment(dateTime, DEFAULT_DATETIME_FORMAT);
//     if (momentDate.isValid()) {
//       const timeZone = getTimeZone();
//       const utc = timeZone2MomentUTC[timeZone] || 8;
//       const utcMoment = momentDate.utcOffset(utc);
//       if (utcMoment.isValid()) {
//         const dateTimeFormat = getTimeFormat();
//         return utcMoment.format(dateTimeFormat);
//       }
//     }
//   }
// }

/**
 * 执行器-注册方式
 * @param {0|1|any} addressType
 * @return 0 -> 自动注册(多语言), 1 -> 手动录入(多语言), other -> ''
 */
export function addressTypeRender(addressType) {
  return addressType === 0
    ? intl.get('hzero.common.jobGroup.auto').d('自动注册')
    : addressType === 1
    ? intl.get('hzero.common.jobGroup.byHand').d('手动录入')
    : '';
}

/**
 * 是否出错 - 渲染方式
 * @param {1|any} v
 * @return 1 -> yes(多语言), other -> no(多语言)
 */
export function isErrorOrNoRender(v) {
  const statusErrorOrNo = ['success', 'error'];
  return (
    <Badge
      status={statusErrorOrNo[v]}
      text={v === 1 ? intl.get('hzero.common.status.yes') : intl.get('hzero.common.status.no')}
    />
  );
}

/**
 * 渲染审批动作描述
 * @author LZY <zhuyan.luo@hand-china.com>
 * @param {string} action - 审批代码
 */
export function approveNameRender(action) {
  let actionText = action;
  switch (action) {
    case 'Approved':
      actionText = <Tag color="green">{intl.get('hzero.common.status.agree').d('同意')}</Tag>;
      break;
    case 'Rejected':
      actionText = <Tag color="red">{intl.get('hzero.common.status.reject').d('拒绝')}</Tag>;
      break;
    case 'ADD_SIGN':
      actionText = <Tag color="gold">{intl.get('hzero.common.status.addSign').d('加签')}</Tag>;
      break;
    case 'DELEGATE':
      actionText = <Tag color="gold">{intl.get('hzero.common.status.delegate').d('转交')}</Tag>;
      break;
    case 'JUMP':
      actionText = <Tag color="gold">{intl.get('hzero.common.status.jump').d('跳转')}</Tag>;
      break;
    case 'RECALL':
      actionText = <Tag color="gold">{intl.get('hzero.common.status.recall').d('撤回')}</Tag>;
      break;
    case 'AUTO_DELEGATE':
      actionText = (
        <Tag color="gold">{intl.get('hzero.common.status.autoDelegate').d('自动转交')}</Tag>
      );
      break;
    case 'CARBON_COPY':
      actionText = <Tag color="gold">{intl.get('hzero.common.status.carbonCopy').d('抄送')}</Tag>;
      break;
    default:
      break;
  }
  return actionText;
}

/**
 * 格式化数值
 * 当 value 为 undefined,null,'',NaN,Infinity,-Infinity时 返回 ''
 * @param {string|number} value 需要格式化的数
 * @param {number} [precision=0] 数值精度 必须为自然数(0+正整数)
 * @param {boolean} [allowThousandth=true] 是否加上千分位
 * @param {boolean} [allowEndZero=true] 是否补全末尾0
 * @return {string}
 */
export function numberRender(value, precision = 0, allowThousandth = true, allowEndZero = true) {
  if (
    // 空检查
    value === null ||
    value === undefined ||
    value === '' ||
    // 非法数值的检查
    +value === Infinity ||
    +value === -Infinity ||
    isNaN(+value)
  ) {
    return '';
  }

  // 将 value 转为字符串并移除千分位
  const valueObject = new Big(String(value).replace(/,/g, ''));
  let ret = valueObject.toFixed(precision);
  if (allowThousandth) {
    const retList = ret.split('.');
    const commaValue = retList[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 整数部分千分位替换

    if (retList.length > 1) {
      ret = [commaValue, retList[1]].join('.');
    } else {
      ret = commaValue;
    }
  }
  if (!allowEndZero && ret.indexOf('.')) {
    return ret.replace(/(0|\.0)*$/, '');
  }
  return ret;
}

/**
 * 返回 激活/未激活 对应的多语言 并加上状态
 * @param {0|1} v 激活状态
 * return 1 ? enable(多语言) : disabled(多语言)
 */
export function activateRender(v) {
  return <Badge status={statusMap[v]} text={v === 1 ? '激活' : '未激活'} />;
}

/**
 * 返回状态标记
 * @param {string} status - 当前状态值
 * @param {array} statusList - 状态列表：[{ color: '' , status: '' }]
 * @param {string} text - 当前状态文本值
 */
export function TagRender(status, statusList = [], text = '') {
  if (status === '' || status === undefined || status === null) return '';
  const currentStatus =
    statusList.find(item => item.status === status) ||
    statusList.find(item => item.status === 'default') ||
    {};
  return <Tag color={currentStatus.color || ''}>{text || currentStatus.text}</Tag>;
}
