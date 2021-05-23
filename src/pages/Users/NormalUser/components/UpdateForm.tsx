import React, { Dispatch, SetStateAction, useRef } from 'react';
import { ProFormText, ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import {message} from 'antd';
import { ActionType } from '@ant-design/pro-table';
import { postUserAvatar } from '@/services/ant-design-pro/api';

type UpdateFormProps = {
    title: string;
    updateModalVisible: boolean;
    currentRow: API.NormalUserItem | undefined;
    setCurrentRow: Dispatch<SetStateAction<API.NormalUserItem | undefined>>;
    handleUpdateModalVisible: Dispatch<SetStateAction<boolean>>;
    handleSubmit: (fields: API.NormalUserItem) => Promise<boolean>;
    type: API.UpdateFormType;
    proTableRef: React.MutableRefObject<ActionType | undefined>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const { title, updateModalVisible, currentRow, setCurrentRow, handleUpdateModalVisible, handleSubmit, type, proTableRef } = props;
    const formRef = useRef<FormInstance>();
    return (
        <ModalForm
            formRef={formRef}
            title={title}
            width="400px"
            visible={updateModalVisible}
            onVisibleChange={(visible) => {
                if (type === "update" && visible === true) {
                    formRef.current?.setFieldsValue(currentRow);
                }
                return handleUpdateModalVisible(visible);
            }}
            onFinish={async (value) => {
                console.log(value);
                const success = await handleSubmit({
                    ...value,
                    user_ID: currentRow?.user_ID,
                } as API.NormalUserItem);
                if (success) {
                    handleUpdateModalVisible(false);
                    setCurrentRow({});
                    formRef.current?.resetFields();
                    proTableRef.current?.reloadAndRest?.();
                }
            }}
            modalProps={{
                onCancel: () => {
                    setCurrentRow({});
                    formRef.current?.resetFields();
                }

            }}
        >
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '用户名为必填项',
                    },
                    {
                        type: "string",
                        message: '用户名为字符串'
                    }
                ]}
                label="用户名"
                placeholder='用户名'
                width="md"
                name="user_Name"
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '密码为必填项',
                    },
                    {
                        type: "string",
                        message: '密码为字符串'
                    }
                ]}
                label='密码'
                placeholder='密码'
                width="md"
                name="user_Passwd"
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '电话号码为必填项',
                    },
                    {
                        type: "string",
                        message: '电话号码为字符串'
                    }
                ]}
                label='电话号码'
                placeholder='电话号码'
                width="md"
                name="user_Phone"
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '电子邮件为必填项',
                    },
                    {
                        type: "email",
                        message: '这是电子邮件吗？'
                    }
                ]}
                label='电子邮件'
                placeholder='电子邮件'
                width="md"
                name="user_Email"
            />
            {type === "update" && (
                <ProFormUploadDragger
                    max={4}
                    label="头像"
                    name="file"
                    fieldProps={{
                        customRequest: async (file) => {

                            const formData = new FormData();
                            formData.append('file',file.file,"[PROXY]");
                            formData.append("user_ID", currentRow?.user_ID?.toString() as string);
                            const hide = message.loading('正在添加');

                            try {
                                await postUserAvatar({
                                    body: formData,
                                });
                                hide();
                                message.success('添加成功');
                                return true;
                            } catch (error) {
                                hide();
                                message.error('添加失败请重试！');
                                return false;
                            }
                        }
                    }}
                />
            )}
        </ModalForm>
    );
};

export default UpdateForm;