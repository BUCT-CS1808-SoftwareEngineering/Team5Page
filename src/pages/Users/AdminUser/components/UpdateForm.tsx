import React, { Dispatch, SetStateAction,useRef } from 'react';
import {ProFormText,ModalForm} from '@ant-design/pro-form';
import type {FormInstance} from 'antd';
import { ActionType } from '@ant-design/pro-table';

type UpdateFormProps = {
    title: string;
    updateModalVisible: boolean;
    currentRow: API.AdminItem;
    setCurrentRow: Dispatch<SetStateAction<API.AdminItem>>;
    handleUpdateModalVisible: Dispatch<SetStateAction<boolean>>;
    handleSubmit: (fields: API.AdminItem) => Promise<boolean>;
    type: API.UpdateFormType;
    proTableRef: React.MutableRefObject<ActionType | undefined>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const {title,updateModalVisible,currentRow,setCurrentRow,handleUpdateModalVisible,handleSubmit,type,proTableRef} = props;
    const formRef = useRef<FormInstance>();
    return (
        <ModalForm
                formRef={formRef}
                title={title}
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={(visible)=>{
                    if(type === "update" && visible===true){
                        formRef.current?.setFieldsValue({
                            admin_Name:currentRow.admin_Name,
                            admin_Passwd:currentRow.admin_Passwd,
                        })
                    }
                    return handleUpdateModalVisible(visible);
                }}
                onFinish={async (value) => {
                    const success = await handleSubmit({
                        ...value,
                        admin_ID:currentRow.admin_ID,
                    } as API.AdminItem);
                    if(success){
                        handleUpdateModalVisible(false);
                        setCurrentRow({});
                        formRef.current?.resetFields();
                        proTableRef.current?.reloadAndRest?.();
                    }
                }}
                modalProps={{
                    onCancel:()=>{
                        setCurrentRow({});
                        formRef.current?.resetFields();
                    }
                    
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '管理员用户名为必填项',
                        },
                        {
                            type:"string",
                            message: '用户名为字符串'
                        }
                    ]}
                    label="管理员用户名"
                    placeholder='管理员用户名'
                    width="md"
                    name="admin_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '管理员密码为必填项',
                        },
                        {
                            type:"string",
                            message: '密码为字符串'
                        }
                    ]}
                    label='管理员密码'
                    placeholder='管理员密码'
                    width="md"
                    name="admin_Passwd"
                />
            </ModalForm>
    );
};

export default UpdateForm;
