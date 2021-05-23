import React, { Dispatch, SetStateAction, useRef } from 'react';
import { ProFormText, ModalForm, ProFormRadio } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { ActionType } from '@ant-design/pro-table';

type UpdateFormProps = {
    title: string;
    updateModalVisible: boolean;
    currentRow: API.CommentItem | undefined;
    setCurrentRow: Dispatch<SetStateAction<API.CommentItem | undefined>>;
    handleUpdateModalVisible: Dispatch<SetStateAction<boolean>>;
    handleSubmit: (fields: API.CommentItem) => Promise<boolean>;
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
                const success = await handleSubmit({
                    ...value,
                    com_ID: currentRow?.com_ID,
                } as API.CommentItem);
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
            <ProFormRadio.Group
                name="com_IfShow"
                label="是否显示"
                initialValue={true}
                options={[
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    }
                ]}
            />
        </ModalForm>
    );
};

export default UpdateForm;