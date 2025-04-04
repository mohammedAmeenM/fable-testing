import React from 'react';
import NavigationMenu from '../components/navmenu/NavigationMenu';
import ScriptsLists from './scriptslists/ScriptsLists';

const ScriptScenesList: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen"> 
      <NavigationMenu />
 
      <div className="flex-1">
        <ScriptsLists />
      </div>
    </div>
  );
};

export default ScriptScenesList;
