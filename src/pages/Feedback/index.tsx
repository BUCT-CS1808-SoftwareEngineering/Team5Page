import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';

import { getFeedback, addFeedback, deleteFeedback,updateFeedback } from '@/services/ant-design-pro/api';
/**
 * 添加博物馆
 *
 * @param fields
 */

const handleAdd = async (fields: API.FeedbackItem) => {
    const hide = message.loading('正在添加');

    try {
        await addFeedback({ ...fields });
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

const handleUpdate = async (fields: API.FeedbackItem) => {
    const hide = message.loading('正在配置');

    try {
        await updateFeedback(fields);
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

const handleRemove = async (selectedRows: API.FeedbackItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteFeedback({
            fdback_ID: element.fdback_ID,
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
    const [currentRow, setCurrentRow] = useState<API.FeedbackItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.FeedbackItem[]>([]);
    const columns: ProColumns<API.FeedbackItem>[] = [
        {
            title: '反馈ID',
            dataIndex: 'fdback_ID',

        },
        {
            title: '博物馆ID',
            dataIndex: 'muse_ID',
            search: false,
        },
        {
            title: '用户ID',
            dataIndex: 'user_ID',
            search: false,
        },
        {
            title: '环境评分',
            dataIndex: 'env_Review',
            search: false,
        },
        {
            title: '展览评分',
            dataIndex: 'exhibt_Review',
            search: false,
        },
        {
            title: '服务评分',
            dataIndex: 'service_Review',
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
            <ProTable<API.FeedbackItem, API.PageParams>
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="fdback_ID"
                search={{
                    labelWidth: 120,
                }}
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
                request={getFeedback}
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
                title={"新建反馈"}
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
