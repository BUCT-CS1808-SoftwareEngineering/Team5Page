import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Image } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import { getExhibition, addExhibition, deleteExhibition } from '@/services/ant-design-pro/api';
/**
 * 添加博物馆
 *
 * @param fields
 */

const handleAdd = async (fields: API.ExhibitionItem) => {
    const hide = message.loading('正在添加');

    try {
        await addExhibition({ ...fields });
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

const handleRemove = async (selectedRows: API.ExhibitionItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteExhibition({
            exhib_ID: element.exhib_ID,
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
    /** 新建窗口的弹窗 */
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<API.ExhibitionItem[]>([]);
    const columns: ProColumns<API.ExhibitionItem>[] = [
        {
            title: '展览ID',
            dataIndex: 'exhib_ID',
            search:false,
        },
        {
            title: '博物馆ID',
            dataIndex: 'muse_ID',
        },
        {
            title: '展览名称',
            dataIndex: 'exhib_Name',
            search: false,
        },
        {
            title: '展览内容',
            dataIndex: 'exhib_Content',
            search: false,
        },
        {
            title: '图片',
            dataIndex: 'exhib_Pic',
            search: false,
            render: (_,record)=>
                <Image
                    src = {record.exhib_Pic}
                />
        }
    ];
    return (
        <PageContainer>
            <ProTable<API.ExhibitionItem, API.PageParams>
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="exhib_ID"
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
                request={getExhibition}
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
                title="新建展览信息"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.ExhibitionItem);

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
                            message: '展览名为必填项',
                        },
                    ]}
                    placeholder='展览名'
                    width="md"
                    name="exhib_Name"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '展览内容为必填项',
                        },
                    ]}
                    placeholder='展览内容'
                    width="md"
                    name="exhib_Content"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '图片为必填项',
                        },
                    ]}
                    placeholder='展览图片'
                    width="md"
                    name="exhib_Pic"
                />
            </ModalForm>
        </PageContainer>
    );
};

export default TableList;
