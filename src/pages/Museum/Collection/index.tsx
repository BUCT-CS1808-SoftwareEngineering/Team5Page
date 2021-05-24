import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Image } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import { getCollection, addCollection, deleteCollection } from '@/services/ant-design-pro/api';
/**
 * 添加藏品
 *
 * @param fields
 */

const handleAdd = async (fields: API.CollectionItem) => {
    const hide = message.loading('正在添加');

    try {
        await addCollection({ ...fields });
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
 * 删除藏品
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.CollectionItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteCollection({
            col_ID: element.col_ID,
        }));
        hide();
        message.success('删除成功，即将刷新');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const TableList: React.FC = () => {
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<API.CollectionItem[]>([]);
    const columns: ProColumns<API.CollectionItem>[] = [
        {
            title: '藏品ID',
            dataIndex: 'col_ID',
            search: false,
        },
        {
            title: '博物馆ID',
            dataIndex: 'muse_ID',
        },
        {
            title: '藏品',
            dataIndex: 'col_Name',
            search: false,
        },
        {
            title: '藏品简介',
            dataIndex: 'col_Intro',
            search: false,
        },
        {
            title: '图片',
            dataIndex: 'col_Photo',
            search: false,
            render: (_,record)=>
                <Image
                    src = {record.col_Photo}
                />
        }
    ];
    return (
        <PageContainer>
            <ProTable<API.CollectionItem, API.PageParams>
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="col_ID"
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
                request={getCollection}
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
                title="新建藏品"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.CollectionItem);

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
                            message: '藏品名为必填项',
                        },
                    ]}
                    placeholder='藏品名'
                    width="md"
                    name="col_Name"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '藏品简介为必填项',
                        },
                    ]}
                    placeholder='藏品简介'
                    width="md"
                    name="col_Intro"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '照片为必填项',
                        },
                    ]}
                    placeholder='照片(url)'
                    width="md"
                    name="col_Photo"
                />
            </ModalForm>
        </PageContainer>
    );
};

export default TableList;
