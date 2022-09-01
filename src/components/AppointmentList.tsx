import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateRange } from 'utils/date';

import { getAppointments, appointmentsSelectors } from 'store/appointments';
import { getPractitioners, practitionersSelectors } from 'store/practitioners';
import { getPatients } from 'store/patients';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) =>
    appointmentsSelectors.selectAll(state.appointments),
  );

  const practitioners = useSelector((state) =>
    practitionersSelectors.selectAll(state.practitioners),
  );

  useEffect(() => {
    dispatch(getAppointments());
    dispatch(getPractitioners());
    dispatch(getPatients());
  }, []);

  return (
    <div>
      {appointments.map((app) => {
        const copiedAppointment = { ...app };
        practitioners.forEach((pra) => {
          const copiedPractitioner = { ...pra };
          if (pra.id == app.practitionerId) {
            delete copiedPractitioner.id;
            Object.assign(copiedAppointment, copiedPractitioner);
            delete copiedAppointment.practitionerId;
          }
        });
        return (
          <Card key={copiedAppointment.id} style={{ marginBottom: '20px' }}>
            <CardHeader title={<Typography>Appointment</Typography>} />
            <Divider />
            <CardContent>
              <p>
                <strong>Practitioner:</strong> {copiedAppointment.firstName}{' '}
                {copiedAppointment.lastName}
              </p>
              <p>
                <strong>Speciality:</strong> {copiedAppointment.speciality}
              </p>
              <p>
                <strong>Date: </strong>
                {formatDateRange({
                  from: new Date(copiedAppointment.startDate),
                  to: new Date(copiedAppointment.endDate),
                })}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AppointmentList;
