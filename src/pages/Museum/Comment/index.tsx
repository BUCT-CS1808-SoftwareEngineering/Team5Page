import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Image } from 'antd';
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

import { getComment, addComment, deleteComment, updateComment } from '@/services/ant-design-pro/api';
/**
 * 添加评论
 *
 * @param fields
 */

const handleAdd = async (fields: API.CommentItem) => {
    const hide = message.loading('正在添加');

    try {
        await addComment({ ...fields });
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
 * 更新评论
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
 * 删除评论
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.CommentItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteComment({
            com_ID: element.com_ID,
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
    /** 更新窗口的弹窗 */

    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.CommentItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.CommentItem[]>([]);
    /** 国际化配置 */

    const intl = useIntl();
    const columns: ProColumns<API.CommentItem>[] = [
        {
            title: '用户ID',
            dataIndex: 'user_ID',
        },
        {
            title: '博物馆ID',
            dataIndex: 'muse_ID',
        },
        {
            title: '评论内容',
            dataIndex: 'com_Info',
            search: false,
        },
        {
            title: '评论时间',
            dataIndex: 'com_Time',
            search: false,
        },
        {
            title: '是否展示',
            dataIndex: 'muse_Address',
            render: (_, fields) =>
                <>
                    {fields.com_IfShow ? "是" : "否"}
                </>,
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
            <ProTable<API.CommentItem, API.PageParams>
                headerTitle={intl.formatMessage({
                    id: 'pages.searchTable.title',
                    defaultMessage: '查询表格',
                })}
                actionRef={actionRef}
                rowKey="com_ID"
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
                request={getComment}
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
                    id: 'pages.searchTable.createForm.新增评论',
                    defaultMessage: '新增评论',
                })}
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.CommentItem);

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
                            message: '用户ID为必填项',
                        },
                    ]}
                    placeholder='用户ID'
                    width="md"
                    name="user_ID"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '博物馆ID为必填项',
                        },
                    ]}
                    placeholder='博物馆ID'
                    width="md"
                    name="muse_ID"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '评论内容为必填项',
                        },
                    ]}
                    placeholder='评论内容'
                    width="md"
                    name="com_Info"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '时间为必填项',
                        },
                    ]}
                    initialValue={new Date().toLocaleDateString()}
                    placeholder="时间"
                    width="md"
                    name="com_Time"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '是否显示为必填项',
                        },
                    ]}
                    initialValue={false}
                    placeholder="是否显示"
                    width="md"
                    name="com_IfShow"
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
