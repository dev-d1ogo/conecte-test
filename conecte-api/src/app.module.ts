import { AuthModule } from '@/application/modules/auth.module';
import { DoctorModule } from '@/application/modules/doctor.module';
import { SchedulingModule } from '@/application/modules/scheduling.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, DoctorModule, SchedulingModule]
})
export class AppModule { }
