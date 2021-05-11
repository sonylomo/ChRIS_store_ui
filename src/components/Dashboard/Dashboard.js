import React, { useState, useEffect, useCallback } from "react";
import { CardGrid, Spinner } from "patternfly-react";
import PropTypes from "prop-types";
import Button from "../Button";
import Client from "@fnndsc/chrisstoreapi";
import styles from "./Dashboard.module.css";
import DashPluginCardView from "./components/DashPluginCardView/DashPluginCardView";
import DashTeamView from "./components/DashTeamView/DashTeamView";
import DashGitHubView from "./components/DashGitHubView/DashGitHubView";
import ChrisStore from "../../store/ChrisStore";
import Notification from "../Notification";
import HttpApiCallError from "../../errors/HttpApiCallError";

const Dashboard = ({ store, ...props }) => {
  const [pluginList, setPluginList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const storeURL = process.env.REACT_APP_STORE_URL;
  const userName = store.get("userName") || "";

  const fetchPlugins = useCallback(() => {
    const client = new Client(storeURL);
    const searchParams = {
      owner_username: store.get("userName"),
      limit: 20,
      offset: 0,
    };
    setLoading(true);
    setPluginList(null);

    return client.getPlugins(searchParams).then((plugins) => {
      setPluginList(plugins.data);
      setLoading(false);
      return plugins.data;
    });
  },[store, storeURL])

  useEffect(() => {
    fetchPlugins().catch((err) => {
      showNotifications(new HttpApiCallError(err));
      console.error(err);
    });
  }, [fetchPlugins]);

  const showNotifications = (error) => {
    setError(error.message);
  };


  const deletePlugin = async (pluginId) => {
    const auth = { token: store.get("authToken") };
    const client = new Client(storeURL, auth);
    let response;

    try {
      response = await client.getPlugin(pluginId);
      await response.delete();
      if (response.data) {
        fetchPlugins();
      } else {
        throw new Error("Delete unsuccessful");
      }
    } catch (error) {
      showNotifications(new HttpApiCallError(error));
      return error;
    }

    return response;
  };

  const editPlugin = (pluginId, publicRepo) => {
    const auth = { token: store.get("authToken") };
    const client = new Client(storeURL, auth);
    let response;

    try {
      response = client
        .getPlugin(pluginId)
        .then((plugin) => plugin.getPluginMeta())
        .then((pluginMeta) => pluginMeta.put({ public_repo: publicRepo }));
      response.then(() => {
        fetchPlugins();
      });
    } catch (error) {
      showNotifications(new HttpApiCallError(error));
      return error;
    }
    return response;
  };

  return(
    <>
      {error && (
          <Notification
            title={error}
            position="top-right"
            variant="danger"
            closeable
            onClose={() => setError(null)}
          />
        )}
        <div className="plugins-stats" {...props}>
          <div className="row plugins-stats-row">
            <div className="title-bar">{`Dashboard for ${userName}`}</div>
            <div className="dropdown btn-group">
              <Button variant="primary" toRoute="/create">
                Add Plugin
              </Button>
            </div>
          </div>
        </div>
        <div className={`cards-pf ${styles['dashboard-body']}`}>
          <CardGrid>
            <div className={styles['dashboard-row']}>
              <Spinner size="lg" loading={loading}>
                <div className={styles['dashboard-left-column']}>
                      <DashPluginCardView
                        plugins={pluginList}
                        onDelete={deletePlugin}
                        onEdit={editPlugin}
                      />
                      <DashTeamView plugins={pluginList} />
                </div>
                <div className={styles['dashboard-right-column']}>
                  <DashGitHubView plugins={pluginList} />
                </div>
              </Spinner>
            </div>
          </CardGrid>
        </div>
    </>
  )
};

Dashboard.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
};
Dashboard.defaultProps = {
  store: {},
};

export default ChrisStore.withStore(Dashboard);
