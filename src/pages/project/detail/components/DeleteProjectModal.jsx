import React, { useState } from "react";
import BaseModal from "../../../../components/BaseModal";
import ProjectApi from "../../../../apis/project";
import { message } from "antd";

export const DeleteProjectModal = ({ open, onCancel, projectId, onSuccess }) => {
  const [projectDeleting, setProjectDeleting] = useState(false);

  const handleDeleteProject = () => {
    if (!projectId) return;

    if (window.confirm("Bạn chắc chắn muốn xoá?")) {
      setProjectDeleting(true);
      ProjectApi.deleteProject(projectId).then((success) => {
        if (success) {
          message.success("Xóa dự án thành công");
          onSuccess && onSuccess();
        } else {
          message.error("Xóa dự án thất bại");
        }
        setProjectDeleting(false);
        onCancel();
      });
    }
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title="Bạn muốn xóa dự án này?"
      okType="danger"
      onOk={handleDeleteProject}
      confirmLoading={projectDeleting}
    ></BaseModal>
  );
};
