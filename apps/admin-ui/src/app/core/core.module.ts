import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CustomHttpClientService } from 'src/app/core/custom-http-client.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [CustomHttpClientService]
})
export class CoreModule {}
