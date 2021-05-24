import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Image } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import { getMuseum, addMuseum, deleteMuseum } from '@/services/ant-design-pro/api';
/**
 * 添加博物馆
 *
 * @param fields
 */

const handleAdd = async (fields: API.MuseumListItem) => {
    const hide = message.loading('正在添加');

    try {
        await addMuseum({ ...fields });
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
 * 删除博物馆
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.MuseumListItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteMuseum({
            muse_ID: element.muse_ID,
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
    const [selectedRowsState, setSelectedRows] = useState<API.MuseumListItem[]>([]);
    const columns: ProColumns<API.MuseumListItem>[] = [
        {
            title: '馆名',
            dataIndex: 'muse_Name',
        },
        {
            title: '简介',
            dataIndex: 'muse_Intro',
            search: false,
        },
        {
            title: '地址',
            dataIndex: 'muse_Address',
            search: false,
        },
        {
            title: '开馆时间',
            dataIndex: 'muse_Opentime',
            search: false,
        },
        {
            title: '门票价格',
            dataIndex: 'muse_price',
            search: false,
        },
        {
            title: '类型',
            dataIndex: 'muse_class',
            search: false,
        },
        {
            title: '图片',
            dataIndex: 'muse_Img',
            search: false,
            render: (_,record)=>
                <Image
                    src = {record.muse_Img}
                />
        }
    ];
    return (
        <PageContainer>
            <ProTable<API.MuseumListItem, API.PageParams>
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="muse_ID"
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
                request={getMuseum}
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
                    const success = await handleAdd(value as API.MuseumListItem);

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
                <ProFormTextArea width="md" name="muse_Intro" />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '地址为必填项',
                        },
                    ]}
                    placeholder='地址'
                    width="md"
                    name="muse_Address"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '门票价格为必填项',
                        },
                    ]}
                    placeholder='门票价格'
                    width="md"
                    name="muse_price"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '类型为必填项',
                        },
                    ]}
                    placeholder='类型'
                    width="md"
                    name="muse_class"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '坐标为必填项',
                        },
                    ]}
                    placeholder='坐标'
                    width="md"
                    name="muse_Location"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '开馆时间为必填项',
                        },
                    ]}
                    placeholder='开馆时间'
                    width="md"
                    name="muse_Opentime"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '英文名为必填项',
                        },
                    ]}
                    placeholder='英文名'
                    width="md"
                    name="muse_Ename"
                />
            </ModalForm>
        </PageContainer>
    );
};

export default TableList;
