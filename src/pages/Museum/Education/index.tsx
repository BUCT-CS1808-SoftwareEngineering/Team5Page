import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Image } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import { getEducation, addEducation, deleteEducation } from '@/services/ant-design-pro/api';
/**
 * 添加教育活动
 *
 * @param fields
 */

const handleAdd = async (fields: API.EducationItem) => {
    const hide = message.loading('正在添加');

    try {
        await addEducation({ ...fields });
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

const handleRemove = async (selectedRows: API.EducationItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteEducation({
            act_ID: element.act_ID,
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
    const [selectedRowsState, setSelectedRows] = useState<API.EducationItem[]>([]);
    const columns: ProColumns<API.EducationItem>[] = [
        {
            title: '活动ID',
            dataIndex: 'act_ID',
            search:false,
        },
        {
            title: '博物馆ID',
            dataIndex: 'muse_ID',
        },
        {
            title: '活动名',
            dataIndex: 'act_Name',
            search: false,
        },
        {
            title: '活动内容',
            dataIndex: 'act_Content',
            search: false,
        },
        {
            title: '时间',
            dataIndex: 'act_Time',
            search: false,
        },
        {
            title: '连接',
            dataIndex: 'act_Url',
            search: false,
        },
        {
            title: '照片',
            dataIndex: 'act_Pic',
            search: false,
            render: (_,record)=>
                <Image
                    onClick={()=>console.log(record)}
                    src = {record.act_Pic}
                />
        }
    ];
    return (
        <PageContainer>
            <ProTable<API.EducationItem, API.PageParams>
                headerTitle='查询表格'
                actionRef={actionRef}
                rowKey="act_ID"
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
                request={getEducation}
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
                title="新建教育活动"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.EducationItem);

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
                            message: '教育活动名称为必填项',
                        },
                    ]}
                    placeholder='名称'
                    width="md"
                    name="act_Name"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '内容为必填项',
                        },
                    ]}
                    placeholder='内容'
                    width="md"
                    name="act_Content"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '时间为必填项',
                        },
                    ]}
                    placeholder='时间'
                    initialValue={new Date().toLocaleDateString()}
                    width="md"
                    name="act_Time"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '照片为必填项',
                        },
                    ]}
                    placeholder='照片'
                    width="md"
                    name="act_Pic"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '链接为必填项',
                        },
                    ]}
                    placeholder='链接'
                    width="md"
                    name="act_Url"
                />
            </ModalForm>
        </PageContainer>
    );
};

export default TableList;
