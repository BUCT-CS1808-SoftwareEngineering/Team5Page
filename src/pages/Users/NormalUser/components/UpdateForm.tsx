import React, { Dispatch, SetStateAction, useRef } from 'react';
import { ProFormText, ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import {message} from 'antd';
import { ActionType } from '@ant-design/pro-table';

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
                        message: '?????????????????????',
                    },
                    {
                        type: "string",
                        message: '?????????????????????'
                    }
                ]}
                label="?????????"
                placeholder='?????????'
                width="md"
                name="user_Name"
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '??????????????????',
                    },
                    {
                        type: "string",
                        message: '??????????????????'
                    }
                ]}
                label='??????'
                placeholder='??????'
                width="md"
                name="user_Passwd"
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '????????????????????????',
                    },
                    {
                        type: "string",
                        message: '????????????????????????'
                    }
                ]}
                label='????????????'
                placeholder='????????????'
                width="md"
                name="user_Phone"
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '????????????????????????',
                    },
                    {
                        type: "email",
                        message: '????????????????????????'
                    }
                ]}
                label='????????????'
                placeholder='????????????'
                width="md"
                name="user_Email"
            />
            {type === "update" && (
                <ProFormUploadDragger
                    max={4}
                    label="??????"
                    name="file"
                    fieldProps={{
                        beforeUpload: (file) =>{
                            const allowUpdateSet = new Set(["image/jpeg","image/png","image/png"]);
                            const isFileUpdateOK = allowUpdateSet.has(file.type);
                            if(!isFileUpdateOK){
                                message.error("????????????????");
                                return false;
                            }
                            return true;
                        },
                        customRequest: async (file) => {

                            const formData = new FormData();
                            formData.append('file',file.file,"[PROXY]");
                            formData.append("user_ID", currentRow?.user_ID?.toString() as string);
                            const hide = message.loading('????????????');

                            try {
                                // await postUserAvatar({
                                //     body: formData,
                                // });
                                console.log("formData",formData);
                                hide();
                                message.success('????????????');
                                return true;
                            } catch (error) {
                                hide();
                                message.error('????????????????????????');
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