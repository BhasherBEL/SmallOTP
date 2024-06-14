import { gql, request } from "graphql-request";

const API_URL = "https://maps.bhasher.com/otp/gtfs/v1";

export async function fetchRoutesAPI(
  from: [number, number],
  to: [number, number],
  mode: string,
  date: Date,
): Promise<any> {
  const document = gql`
		{
			plan(
				from: {
					lat: ${from[0]}
					lon: ${from[1]}
				}
				to: {
					lat: ${to[0]}
					lon: ${to[1]}
				}
				date: "${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}"
				time: "${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}"
				transportModes: [
					{
						mode: ${mode}
					}
				]
			)
			{
				itineraries {
            startTime
            endTime
						duration
            legs {
                mode
                startTime
                endTime
								duration
								steps {
									streetName
									distance
									lon
									lat
								}
            }
        }
			}
		}
	`;

  return await request(API_URL, document);
}
