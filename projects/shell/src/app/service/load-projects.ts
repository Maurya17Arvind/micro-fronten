import { loadRemoteModule } from '@angular-architects/native-federation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadProjects {
  async loadRemoteComponent(
    port: number,
    remoteName: string,
    exposedModule: string = './Component'
  ): Promise<any> {
    try {
      console.log(
        `Attempting to load ${remoteName} from http://localhost:${port}/remoteEntry.json`
      );

      const module = await loadRemoteModule({
        remoteEntry: `http://localhost:${port}/remoteEntry.json`,
        remoteName,
        exposedModule: exposedModule,
      });

      console.log(`Module loaded for ${remoteName}:`, Object.keys(module));

      // For Native Federation, the component is typically the default export
      // or the named export matching the class name
      const component = module.default || module.App || module[Object.keys(module)[0]] || module;

      if (!component) {
        throw new Error(`No valid component found in ${remoteName} module`);
      }

      console.log(
        `Component extracted for ${remoteName}:`,
        component.name || 'Anonymous Component'
      );
      return component;
    } catch (error) {
      console.error(`Failed to load remote component ${remoteName} from port ${port}:`, error);
      throw error;
    }
  }
}
