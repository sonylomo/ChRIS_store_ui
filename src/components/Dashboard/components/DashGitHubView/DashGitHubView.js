// import {Card, CardTitle, CardBody, ListView, Col} from '@patternfly/react-core';
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import isEmpty from "lodash/isEmpty";
import { Col, ListView } from "patternfly-react";
import PropTypes from "prop-types";
import React from "react";
import BrainyPointer from "../../../../assets/img/brainy-pointer.png";
import styles from "./DashGitHubView.module.css";

const DashGitHubEmptyState = () => (
  <div>
    <span className={`pficon pficon-info`} id={styles["no-plugin-info-icon"]} />
    <span className={styles["github-plugin-noplugin-title"]}>
      Revisions Panel
    </span>
    <p className={styles["github-plugin-noplugin-text"]}>
      The most recent 10 changes to your plugins will appear here.
    </p>
    <div>
      <img src={BrainyPointer} alt="Click Add Plugin" />
    </div>
  </div>
);

const DashGitHubView = ({ plugins, ...props }) => {
  const showEmptyState = isEmpty(plugins);

  return (
    <Col sm={12} {...props}>
      <Card>
        <CardTitle>Revisions to My Plugins</CardTitle>
        <CardBody className={styles["github-card-body"]}>
          {showEmptyState ? (
            <DashGitHubEmptyState />
          ) : (
            <ListView className={styles["github-description"]} />
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

DashGitHubView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object),
};

DashGitHubView.defaultProps = {
  plugins: [],
};

export default DashGitHubView;
