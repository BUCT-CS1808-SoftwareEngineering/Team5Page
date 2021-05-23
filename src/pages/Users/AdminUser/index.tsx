import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm'
import { getAdmin, addAdmin, deleteAdmin,updateAdmin } from '@/services/ant-design-pro/api';

/**
 * 添加管理员
 *
 * @param fields
 */

const handleAdd = async (fields: API.AdminItem) => {
    const hide = message.loading('正在添加');

    try {
        await addAdmin({ ...fields });
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
 * 更新管理员
 *
 * @param fields
 */

const handleUpdate = async (fields: API.AdminItem) => {
    const hide = message.loading('正在配置');

    try {
        await updateAdmin(fields);
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
 * 删除管理员
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.AdminItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteAdmin({
            admin_ID: element.admin_ID,
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
    const [currentRow, setCurrentRow] = useState<API.AdminItem>({});
    const [selectedRowsState, setSelectedRows] = useState<API.AdminItem[]>([]);

    const intl = useIntl();
    const columns: ProColumns<API.AdminItem>[] = [
        {
            title: '管理员ID',
            dataIndex: 'admin_ID',
        },
        {
            title: '管理员用户名',
            dataIndex: 'admin_Name',
            search: false,
        },
        {
            title: '密码',
            dataIndex: 'admin_Passwd',
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
            <ProTable<API.AdminItem, API.PageParams>
                headerTitle={intl.formatMessage({
                    id: 'pages.searchTable.title',
                    defaultMessage: '查询表格',
                })}
                actionRef={actionRef}
                rowKey="admin_ID"
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
                request={getAdmin}
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
                title={"新建管理员"}
                updateModalVisible={createModalVisible}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                handleUpdateModalVisible={handleModalVisible}
                handleSubmit={handleAdd}
                proTableRef={actionRef}
                type={"add"}
            />
            <UpdateForm 
                title={"修改管理员"}
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
