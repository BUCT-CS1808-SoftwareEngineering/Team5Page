import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer,Image } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { updateRule } from '@/services/ant-design-pro/api';

import { getAdmin, addAdmin, deleteAdmin,updateAdmin } from '@/services/ant-design-pro/api';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
/**
 * 添加博物馆
 *
 * @param fields
 */

const handleAdd = async (fields: API.AdminItem) => {
    const hide = message.loading('正在添加');

    try {
        await addAdmin({ ...fields });
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败请重试！');
        return false;
    }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: API.AdminItem) => {
    const hide = message.loading('正在配置');

    try {
        await updateRule(fields);
        hide();
        message.success('配置成功');
        return true;
    } catch (error) {
        hide();
        message.error('配置失败请重试！');
        return false;
    }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.AdminItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteAdmin({
            admin_ID: element.admin_ID,
        }));
        hide();
        message.success('删除成功');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const TableList: React.FC = () => {
    /** 新建窗口的弹窗 */
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    /** 分布更新窗口的弹窗 */

    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.AdminItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.AdminItem[]>([]);
    /** 国际化配置 */

    const intl = useIntl();
    const columns: ProColumns<API.AdminItem>[] = [
        {
            title: '管理员ID',
            dataIndex: 'admin_ID',
        },
        {
            title: '管理员用户名',
            dataIndex: 'admin_Name',
            search: false,
        },
        {
            title: '密码',
            dataIndex: 'admin_Passwd',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="config"
                    onClick={() => {
                        handleUpdateModalVisible(true);
                        setCurrentRow(record);
                    }}
                >
                    更新
                </a>,
            ],
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.AdminItem, API.PageParams>
                headerTitle={intl.formatMessage({
                    id: 'pages.searchTable.title',
                    defaultMessage: '查询表格',
                })}
                actionRef={actionRef}
                rowKey="admin_ID"
                search={false}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalVisible(true);
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={getAdmin}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            已选择{' '}
                            <a
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                {selectedRowsState.length}
                            </a>{' '}
                            项 &nbsp;&nbsp;
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            await handleRemove(selectedRowsState);
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        批量删除
                    </Button>
                </FooterToolbar>
            )}
            <ModalForm
                title={intl.formatMessage({
                    id: 'pages.searchTable.createForm.新建管理员',
                    defaultMessage: '新建管理员',
                })}
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.AdminItem);

                    if (success) {
                        handleModalVisible(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '管理员用户名为必填项',
                        },
                    ]}
                    placeholder='管理员用户名'
                    width="md"
                    name="admin_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '管理员密码为必填项',
                        },
                    ]}
                    placeholder='管理员密码'
                    width="md"
                    name="admin_Passwd"
                />
            </ModalForm>
            <ModalForm
                title={intl.formatMessage({
                    id: '修改管理员',
                    defaultMessage: '修改管理员',
                })}
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={handleUpdateModalVisible}
                onFinish={async (value) => {
                    const success = await handleUpdate(value as API.AdminItem);

                    if (success) {
                        handleUpdateModalVisible(false);

                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '管理员用户名为必填项',
                        },
                    ]}
                    placeholder='管理员用户名'
                    width="md"
                    name="admin_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '管理员密码为必填项',
                        },
                    ]}
                    placeholder='管理员密码'
                    width="md"
                    name="admin_Passwd"
                />
            </ModalForm>
            {/* <UpdateForm
                onSubmit={async (value) => {
                    const success = await handleUpdate(value);

                    if (success) {
                        handleUpdateModalVisible(false);
                        setCurrentRow(undefined);

                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                onCancel={() => {
                    handleUpdateModalVisible(false);
                    setCurrentRow(undefined);
                }}
                updateModalVisible={updateModalVisible}
                values={currentRow || {}}
            /> */}

            <Drawer
                width={600}
                visible={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.name && (
                    <ProDescriptions<API.RuleListItem>
                        column={2}
                        title={currentRow?.name}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.name,
                        }}
                        columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default TableList;
