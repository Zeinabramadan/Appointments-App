import timeslots from './timeslots';
import appointments from './appointments';
import practitioners from './practitioners';
import patients from './patients';
import availabilities from './availabilities';

export default {
  timeslots: timeslots.reducer,
  appointments: appointments.reducer,
  practitioners: practitioners.reducer,
  patients: patients.reducer,
  availabilities: availabilities.reducer,
};
