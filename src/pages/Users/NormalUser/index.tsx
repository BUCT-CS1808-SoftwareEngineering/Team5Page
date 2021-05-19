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

import { getNormalUser, addNormalUser, deleteNormalUser,updateNormalUser } from '@/services/ant-design-pro/api';
/**
 * 添加博物馆
 *
 * @param fields
 */

const handleAdd = async (fields: API.NormalUserItem) => {
    const hide = message.loading('正在添加');

    try {
        await addNormalUser({ ...fields });
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

const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('正在配置');

    try {
        await updateRule({
            name: fields.name,
            desc: fields.desc,
            key: fields.key,
        });
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

const handleRemove = async (selectedRows: API.NormalUserItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteNormalUser({
            user_ID: element.user_ID,
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
    const [currentRow, setCurrentRow] = useState<API.NormalUserItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.NormalUserItem[]>([]);
    /** 国际化配置 */

    const intl = useIntl();
    const columns: ProColumns<API.NormalUserItem>[] = [
        {
            title: '用户ID',
            dataIndex: 'user_ID',
        },
        {
            title: '用户名',
            dataIndex: 'user_Name',
            search: false,
        },
        {
            title: '密码',
            dataIndex: 'user_Passwd',
            search: false,
        },
        {
            title: '电话',
            dataIndex: 'user_Phone',
            search: false,
        },
        {
            title: '邮箱',
            dataIndex: 'user_Email',
            search: false,
        },
        {
            title: '评论权限',
            dataIndex: 'if_com',
            search: false,
        },
        {
            title: '头像',
            dataIndex: 'user_Avatar',
            search: false,
            render: (_,record)=>
                <Image
                    src = {record.user_Avatar}
                />
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
            <ProTable<API.NormalUserItem, API.PageParams>
                headerTitle={intl.formatMessage({
                    id: 'pages.searchTable.title',
                    defaultMessage: '查询表格',
                })}
                actionRef={actionRef}
                rowKey="user_ID"
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
                request={getNormalUser}
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
                    id: 'pages.searchTable.createForm.新建用户',
                    defaultMessage: '新建用户',
                })}
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.NormalUserItem);

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
                            message: '博物馆名为必填项',
                        },
                    ]}
                    placeholder='博物馆名'
                    width="md"
                    name="muse_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '用户名为必填项',
                        },
                    ]}
                    placeholder='用户名'
                    width="md"
                    name="user_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '密码为必填项',
                        },
                    ]}
                    placeholder='密码'
                    width="md"
                    name="user_Passwd"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '手机号为必填项',
                        },
                    ]}
                    placeholder='手机号'
                    width="md"
                    name="user_Phone"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '电子邮件为必填项',
                        },
                    ]}
                    placeholder='电子邮件'
                    width="md"
                    name="user_Email"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '评论权限为必填项',
                        },
                    ]}
                    placeholder='评论权限'
                    width="md"
                    name="if_com"
                />
            </ModalForm>
            <UpdateForm
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
            />

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
