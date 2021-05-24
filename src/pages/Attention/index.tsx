import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';

import { getAttention, addAttention, deleteAttention } from '@/services/ant-design-pro/api';
/**
 * 添加关注
 *
 * @param fields
 */

const handleAdd = async (fields: API.AttentionItem) => {
    const hide = message.loading('正在添加');

    try {
        await addAttention({ ...fields });
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
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.AttentionItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteAttention({
            att_ID: element.att_ID,
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
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.AttentionItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.AttentionItem[]>([]);
    const columns: ProColumns<API.AttentionItem>[] = [
        {
            title: '关注ID',
            dataIndex: 'att_ID',
            search: false,
        },
        {
            title: '博物馆ID',
            dataIndex: 'muse_ID',
        },
        {
            title: '用户ID',
            dataIndex: 'user_ID',
            search: false,
        }
    ];
    return (
        <PageContainer>
            <ProTable<API.AttentionItem, API.PageParams>
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="att_ID"
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
                request={getAttention}
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
                title="新建博物馆"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.AttentionItem);

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
                            message: '博物馆ID为必填项',
                        },
                    ]}
                    placeholder='博物馆ID'
                    width="md"
                    name="muse_ID"
                />
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
            </ModalForm>
        </PageContainer>
    );
};

export default TableList;
