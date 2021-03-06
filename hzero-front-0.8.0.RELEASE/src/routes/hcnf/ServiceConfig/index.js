/**
 * serviceConfig - 服务配置
 * @date: 2019-1-23
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Button, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { Content, Header } from 'components/Page';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { yesOrNoRender } from 'utils/renderer';
import { tableScrollWidth } from 'utils/utils';

import FilterForm from './FilterForm';
import Drawer from './Drawer';

@formatterCollections({ code: ['hcnf.serviceConfig'] })
@connect(({ loading, hcnfServiceConfig }) => ({
  hcnfServiceConfig,
  fetchLoading: loading.effects['hcnfServiceConfig/fetchServiceConfigList'],
  fetchDetailLoading: loading.effects['hcnfServiceConfig/fetchServiceConfigDetail'],
  updateLoading: loading.effects['hcnfServiceConfig/updateServiceConfig'],
  createLoading: loading.effects['hcnfServiceConfig/createServiceConfig'],
  refreshLoading: loading.effects['hcnfServiceConfig/refreshServiceConfig'],
}))
export default class ServiceConfig extends React.PureComponent {
  state = {
    modalVisible: false,
    fieldsValue: {},
  };

  componentDidMount() {
    this.fetchServiceConfigList();
  }

  fetchServiceConfigList(params = {}) {
    const {
      dispatch,
      hcnfServiceConfig: { defaultProductEnv = [] },
    } = this.props;
    const { fieldsValue } = this.state;
    const [productId, productEnvId] = defaultProductEnv;
    dispatch({
      type: 'hcnfServiceConfig/fetchServiceConfigList',
      payload: { productId, productEnvId, ...fieldsValue, ...params },
    });
  }

  @Bind()
  handleRefresh(record) {
    const that = this;
    const { dispatch } = this.props;
    Modal.confirm({
      title: `${intl.get('hsgp.common.view.message.confirm.refresh').d('确定要刷新')}?`,
      content: '将动态刷新服务配置',
      onOk() {
        dispatch({
          type: 'hcnfServiceConfig/refreshServiceConfig',
          payload: { serviceConfigId: record.serviceConfigId },
        }).then(res => {
          if (res) {
            notification.success();
            that.fetchServiceConfigList();
          }
        });
      },
    });
  }

  /**
   * 查询表单
   * @param {object} form - 查询表单
   */
  @Bind()
  handleSearch(form) {
    const fieldsValue = form.getFieldsValue();
    this.setState({ fieldsValue });
    this.fetchServiceConfigList({ ...fieldsValue, page: {} });
  }

  /**
   * 重置查询表单
   * @param {object} form - 查询表单
   */
  @Bind()
  handleResetSearch(form) {
    this.setState({ fieldsValue: {} });
    form.resetFields();
  }

  /**
   * handlePagination - 分页设置
   * @param {object} pagination - 分页对象
   */
  @Bind()
  handlePagination(pagination) {
    this.fetchServiceConfigList({ page: pagination });
  }

  /**
   * 控制modal显示与隐藏
   * @param {boolean}} flag 是否显示modal
   */
  handleModalVisible(flag) {
    this.setState({ modalVisible: flag });
  }

  /**
   * 显示编辑模态框
   * @param {object} record - 编辑的行数据
   */
  @Bind()
  showModal(record = {}) {
    const { dispatch } = this.props;
    if (record.serviceConfigId) {
      dispatch({
        type: 'hcnfServiceConfig/fetchServiceConfigDetail',
        payload: {
          serviceConfigId: record.serviceConfigId,
        },
      });
    } else {
      dispatch({
        type: 'hcnfServiceConfig/updateState',
        payload: { serviceConfigDetail: {} },
      });
    }
    this.handleModalVisible(true);
  }

  /**
   * 关闭模态框
   */
  @Bind()
  hideModal() {
    this.handleModalVisible(false);
  }

  @Bind()
  handleUpdateRoute(fieldsValue) {
    const {
      dispatch,
      hcnfServiceConfig: { defaultProductEnv: defaultValue = [], serviceConfigDetail = {} },
    } = this.props;
    dispatch({
      type: `hcnfServiceConfig/${
        serviceConfigDetail.serviceConfigId !== undefined
          ? 'updateServiceConfig'
          : 'createServiceConfig'
      }`,
      payload: {
        ...serviceConfigDetail,
        productId: defaultValue[0],
        productEnvId: defaultValue[1],
        ...fieldsValue,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.hideModal();
        this.fetchServiceConfigList();
      }
    });
  }

  /**
   * 删除服务路由
   * @param {object} record - 删除的行数据
   */
  @Bind()
  handleDeleteServiceConfig(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'hcnfServiceConfig/deleteServiceConfig',
      payload: record,
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchServiceConfigList();
      }
    });
  }

  render() {
    const {
      fetchLoading = false,
      updateLoading = false,
      createLoading = false,
      fetchDetailLoading = false,
      refreshLoading = false,
      hcnfServiceConfig: { serviceConfigList = [], serviceConfigDetail = {}, pagination = {} },
    } = this.props;
    const { modalVisible } = this.state;
    const drawerProps = {
      title:
        serviceConfigDetail.serviceConfigId !== undefined
          ? intl.get('hcnf.serviceConfig.view.message.editor.edit').d('编辑服务配置')
          : intl.get('hcnf.serviceConfig.view.message.editor.create').d('新建服务配置'),
      modalVisible,
      initData: serviceConfigDetail,
      initLoading: fetchDetailLoading,
      loading: serviceConfigDetail.serviceConfigId !== undefined ? updateLoading : createLoading,
      onCancel: this.hideModal,
      onOk: this.handleUpdateRoute,
    };
    const columns = [
      {
        title: intl.get('hsgp.common.model.common.serviceCode').d('服务编码'),
        dataIndex: 'serviceCode',
      },
      {
        title: intl.get('hsgp.common.model.common.configVersion').d('配置版本'),
        dataIndex: 'configVersion',
        width: 120,
      },
      {
        title: intl.get('hcnf.serviceConfig.model.serviceConfig.default').d('是否默认'),
        width: 100,
        dataIndex: 'defaultFlag',
        render: yesOrNoRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 170,
        fixed: 'right',
        render: (text, record) => {
          return (
            <span className="action-link">
              <a onClick={() => this.handleRefresh(record)}>刷新配置</a>
              <a onClick={() => this.showModal(record)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <Popconfirm
                title={intl
                  .get('hsgp.nodeRule.view.message.confirm.remove')
                  .d('是否删除此条记录？')}
                onConfirm={() => this.handleDeleteServiceConfig(record)}
              >
                <a>{intl.get('hzero.common.button.delete').d('删除')}</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    return (
      <React.Fragment>
        <Header title={intl.get('hcnf.serviceConfig.view.message.title').d('服务配置')}>
          <Button type="primary" icon="plus" style={{ marginLeft: 10 }} onClick={this.showModal}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm search={this.handleSearch} reset={this.handleResetSearch} />
          </div>
          <Table
            bordered
            rowKey="serviceConfigId"
            loading={fetchLoading || refreshLoading}
            dataSource={serviceConfigList}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={pagination}
            onChange={this.handlePagination}
          />
          <Drawer {...drawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
