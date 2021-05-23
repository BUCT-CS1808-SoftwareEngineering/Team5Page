import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';

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

const handleUpdate = async (fields: API.CommentItem) => {
    const hide = message.loading('正在配置');

    try {
        await updateComment(fields);
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
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.CommentItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.CommentItem[]>([]);

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
                headerTitle="查询表格"
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
            <UpdateForm 
                title={"新建评论"}
                updateModalVisible={createModalVisible}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                handleUpdateModalVisible={handleModalVisible}
                handleSubmit={handleAdd}
                proTableRef={actionRef}
                type={"add"}
            />
            <UpdateForm 
                title={"修改评论"}
                updateModalVisible={updateModalVisible}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                handleUpdateModalVisible={handleUpdateModalVisible}
                handleSubmit={handleUpdate}
                proTableRef={actionRef}
                type={"update"}
            />
        </PageContainer>
    );
};

export default TableList;
