import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';

import { getNormalUser, addNormalUser, deleteNormalUser, updateNormalUser, postUserAvatar } from '@/services/ant-design-pro/api';
import Avatar from 'antd/lib/avatar/avatar';
/**
 * 添加用户
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

const handleUpdate = async (fields: API.NormalUserItem|any) => {
    const hide = message.loading('正在配置');

    try {
        // console.log("fields",fields);
        const formData = new FormData();
        formData.append('file', fields.file[0]);
        formData.append("user_ID", fields?.user_ID?.toString() as string);
        // await postUserAvatar({
        //     body: formData
        // })
        console.log("handleUpdate",formData);
        const newFields = Object.assign(fields);
        delete newFields.file;
        // await updateNormalUser(newFields);
        hide();
        message.success('配置成功');
        return true;
    } catch (error) {
        hide();
        // console.log("eroor",error);
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
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.NormalUserItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.NormalUserItem[]>([]);

    const columns: ProColumns<API.NormalUserItem>[] = [
        {
            title: '用户ID',
            dataIndex: 'user_ID',
            render: (_, record) =>
                <>
                    <Avatar
                        src={`http://192.144.230.213:8081${record.user_Avatar}`}
                    />
                    {record.user_Name}
                </>
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
                headerTitle="查询表格"
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
            <UpdateForm
                title={"新建用户"}
                updateModalVisible={createModalVisible}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                handleUpdateModalVisible={handleModalVisible}
                handleSubmit={handleAdd}
                proTableRef={actionRef}
                type={"add"}
            />
            <UpdateForm
                title={"修改用户"}
                updateModalVisible={updateModalVisible}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                handleUpdateModalVisible={handleUpdateModalVisible}
                handleSubmit={handleUpdate}
                proTableRef={actionRef}
                type={"update"}
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
                {currentRow?.user_Name && (
                    <ProDescriptions<API.RuleListItem>
                        column={2}
                        title={currentRow?.user_Name}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.user_Name,
                        }}
                        columns={columns as ProDescriptionsItemProps<API.NormalUserItem>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default TableList;
