import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => {
    const bt = bootstrapApplication(AppComponent, config)
    
    bt.catch((err) => console.error(err));

    return bt;
}

export default bootstrap;
