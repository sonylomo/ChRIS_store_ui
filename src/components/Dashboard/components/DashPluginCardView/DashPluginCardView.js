import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import {
  EmptyStateAction,
  EmptyStateInfo,
  FieldLevelHelp,
  MessageDialog,
} from "patternfly-react";
import {
  CardTitle,
  CardBody,
  Card,
  DropdownItem,
  Dropdown,
  KebabToggle,
  GridItem,
  Grid,
  Form,
} from "@patternfly/react-core";
import Button from "../../../Button";
import styles from "./DashPluginCardView.module.css";
import BrainImg from "../../../../assets/img/empty-brain-xs.png";
import PluginPointer from "../../../../assets/img/brainy_welcome-pointer.png";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import FormInput from "../../../FormInput";

const DashGitHubEmptyState = () => (
  <Card>
    <CardTitle>My Plugins</CardTitle>
    <CardBody className={styles["card-body-empty"]}>
      <h1 className={styles["card-body-header-text"]}>
        You have no plugins in the ChRIS store
      </h1>
      <h2 className={styles["card-body-subhead"]}>Lets fix that!</h2>
      <div className={styles["card-body-content-parent"]}>
        <div>
          <img src={PluginPointer} alt="Click Add Plugin" />
        </div>
        <div className={styles["card-body-content-child-right"]}>
          <p>
            Create a new listing for your plugin in the ChRIS store by clicking
            &#34;Add Plugin&#34; below.
          </p>
          <Button variant="primary" toRoute="/create">
            Add Plugin
          </Button>
        </div>
      </div>
    </CardBody>
  </Card>
);

const DashApplicationType = (type) => {
  if (type === "ds") {
    return (
      <>
        <span className="fa fa-database" /> Data System
      </>
    );
  }
  return (
    <>
      <span className="fa fa-file" /> File System
    </>
  );
};

const DashPluginCardView = ({ onDelete, onEdit, plugins, ...props }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [pluginToDelete, setPluginToDelete] = useState(null);
  const [pluginToEdit, setPluginToEdit] = useState(null);
  const [publicRepo, setPublicRepo] = useState("");
  const [isOpen, setIsOpen] = useState([]);

  const deletePlugin = () => {
    onDelete(pluginToDelete.id);
    setShowDeleteConfirmation(false);
  };

  const secondaryDeleteAction = () => {
    setShowDeleteConfirmation(false);
  };

  const showDeleteModal = (plugin) => {
    setShowDeleteConfirmation(true);
    setPluginToDelete(plugin);
  };

  const editPlugin = () => {
    onEdit(pluginToEdit.id, publicRepo);
    setShowEditConfirmation(false);
  };

  const secondaryEditAction = () => {
    setShowEditConfirmation(false);
  };

  const showEditModal = (plugin) => {
    setShowEditConfirmation(true);
    setPluginToEdit(plugin);
  };

  const handlePublicRepo = (value) => {
    setPublicRepo(value);
  };

  const toggle = (value, id) => {
    const pluginLength = plugins.length;
    let isOpen = new Array(pluginLength);
    isOpen[id] = value;
    setIsOpen([...isOpen]);
  };

  const onSelect = (event, plugin) => {
    const actionType = event.target.innerText;
    if (actionType.includes("Edit")) {
      showEditModal(plugin);
    } else if (actionType.includes("Delete")) {
      showDeleteModal(plugin);
    }
  };

  let pluginCardBody;
  const showEmptyState = isEmpty(plugins);
  const primaryDeleteContent = <p className="lead">Are you sure?</p>;
  const secondaryDeleteContent = (
    <p>
      Plugin <b>{pluginToDelete ? pluginToDelete.name : null}</b> will be
      permanently deleted
    </p>
  );

  const secondaryEditContent = pluginToEdit ? (
    <Grid sm={12} md={12} x12={12} lg={12} className="edit-grid">
      <GridItem>
        <Form isHorizontal>
          <FormInput
            formLabel="Public Repo"
            inputType="text"
            defaultValue={pluginToEdit.public_repo}
            onChange={(value) => handlePublicRepo(value)}
            fieldName="publicRepo"
            helperText="Enter the public repo URL for your plugin"
          />
        </Form>
      </GridItem>
    </Grid>
  ) : null;

  const addNewPlugin = (
    <GridItem key="addNewPlugin">
      <Card>
        <CardBody className={styles['card-view-add-plugin']}>
          <div>
            <img width="77" height="61" src={BrainImg} alt="Add new plugin" />
          </div>
          <EmptyStateInfo>
            Click below to add a new ChRIS plugin
          </EmptyStateInfo>
          <EmptyStateAction>
            <Button variant="primary" toRoute="/create">
              Add Plugin
            </Button>
          </EmptyStateAction>
        </CardBody>
      </Card>
    </GridItem>
  );

  if (plugins) {
    pluginCardBody = plugins.map((plugin, id) => {
      const creationDate = new RelativeDate(plugin.creation_date);
      const applicationType = DashApplicationType(plugin.type);
      return (
        <GridItem  key={plugin.name}>
          <Card>
            <CardTitle className={styles['card-view-title']}>
              <div>
                <Link to={`/plugin/${plugin.id}`} href={`/plugin/${plugin.id}`}>
                  {plugin.name}
                </Link>
                <div className={styles['card-view-tag-title']}>
                  <FieldLevelHelp content={<div>{plugin.description}</div>} />
                </div>
              </div>
              <Dropdown
                className={styles['card-view-kebob']}
                onSelect={(event) => onSelect(event, plugin)}
                toggle={<KebabToggle onToggle={(value) => toggle(value, id)} id={`kebab-${plugin.id}`}/>}
                isOpen={isOpen[id]}
                isPlain
                dropdownItems={[
                  <DropdownItem key={`edit-${plugin.id}`} id="edit" className="kebab-item">Edit</DropdownItem>,
                  <DropdownItem key={`delete-${plugin.id}`} id="delete" className="kebab-item">Delete</DropdownItem>
                ]}
              />
              
            </CardTitle>
            <CardBody>
              <div className={styles['card-view-app-type']}>{applicationType}</div>
              <div>
                <div className={styles['card-view-plugin-tag']}>
                  {`Version ${plugin.version}`}
                </div>
              </div>
              <div>
                <div className={styles['card-view-plugin-tag']}>
                  {creationDate.isValid() &&
                    `Created ${creationDate.format()}`}
                </div>
              </div>
              <div>
                <div className={styles['card-view-plugin-tag']}>
                  {`${plugin.license} license`}
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      );
    });
    pluginCardBody.push(addNewPlugin);
  }

  return showEmptyState ? (
    <DashGitHubEmptyState />
  ) : (
    <>
      <div className={styles['card-view-row']}>
        <Grid sm={12} md={4} lg={4} x12={4} hasGutter className={styles['card-view-grid']}>
        {pluginCardBody}
        </Grid>
        <MessageDialog
          show={showDeleteConfirmation}
          onHide={secondaryDeleteAction}
          primaryAction={deletePlugin}
          secondaryAction={secondaryDeleteAction}
          primaryActionButtonContent="Delete"
          secondaryActionButtonContent="Cancel"
          primaryActionButtonBsStyle="danger"
          title="Plugin Delete Confirmation"
          primaryContent={primaryDeleteContent}
          secondaryContent={secondaryDeleteContent}
          accessibleName="deleteConfirmationDialog"
          accessibleDescription="deleteConfirmationDialogContent"
        />
        <MessageDialog
          show={showEditConfirmation}
          onHide={secondaryEditAction}
          primaryAction={editPlugin}
          secondaryAction={secondaryEditAction}
          primaryActionButtonContent="Save"
          secondaryActionButtonContent="Cancel"
          title="Edit Plugin Details"
          secondaryContent={secondaryEditContent}
          accessibleName="editConfirmationDialog"
          accessibleDescription="editConfirmationDialogContent"
        />
      </div>
    </>
  );
};

DashPluginCardView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

DashPluginCardView.defaultProps = {
  plugins: [],
};

export default DashPluginCardView;
