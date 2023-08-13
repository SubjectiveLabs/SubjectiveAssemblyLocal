use std::collections::HashMap;

pub type BellName = String;
pub type Time = u16;

#[derive(Debug, PartialEq, Eq, Default, Clone)]
pub struct Bell {
    pub name: BellName,
    pub time: Time,
}

impl PartialOrd for Bell {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        self.time.partial_cmp(&other.time)
    }
}

impl Ord for Bell {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.time.cmp(&other.time)
    }
}

#[derive(Default, Debug, PartialEq, Eq)]
pub struct Timetable {
    pub version: [u8; 3],
    pub bells: HashMap<u8, Bell>,
}

impl Timetable {
    pub fn deserialise(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.extend_from_slice(&self.version);
        let timetable = {
            let mut pairs = self.bells.iter().collect::<Vec<_>>();
            pairs.sort_unstable_by_key(|(_, bell)| (*bell).clone());
            pairs
        };

        for (id, Bell { name, time }) in timetable {
            bytes.push(*id);
            #[allow(clippy::cast_possible_truncation)]
            bytes.push(name.as_bytes().len() as u8);
            bytes.extend_from_slice(name.as_bytes());
            bytes.extend_from_slice(&time.to_be_bytes());
        }
        bytes
    }
    pub fn serialise(bytes: &[u8]) -> Self {
        let mut bytes = bytes.iter().copied().peekable();
        let version: [u8; 3] = bytes.next_chunk().unwrap();
        let mut bells = HashMap::new();
        while bytes.peek().is_some() {
            let id = bytes.next().unwrap();
            let name_len = bytes.next().unwrap();
            let name = String::from_utf8(bytes.by_ref().take(name_len.into()).collect()).unwrap();
            let time = u16::from_be_bytes(bytes.next_chunk().unwrap());
            bells.insert(id, Bell { name, time });
        }
        Self { version, bells }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deserialise() {
        let mut timetable = Timetable {
            version: [0; 3],
            bells: HashMap::new(),
        };
        timetable.bells.insert(
            0,
            Bell {
                name: "a".into(),
                time: 1,
            },
        );
        timetable.bells.insert(
            1,
            Bell {
                name: "b".into(),
                time: 2,
            },
        );
        timetable.bells.insert(
            2,
            Bell {
                name: "c".into(),
                time: 3,
            },
        );
        let bytes = timetable.deserialise();
        assert_eq!(bytes, vec![0, 0, 0, 0, 1, 97, 0, 1, 1, 1, 98, 0, 2, 2, 1, 99, 0, 3]);
    }

    #[test]
    fn test_serialise() {
        let bytes = vec![0, 0, 0, 0, 1, 97, 0, 1, 1, 1, 98, 0, 2, 2, 1, 99, 0, 3];
        let timetable = Timetable::serialise(&bytes);
        assert_eq!(timetable.version, [0, 0, 0]);
        assert_eq!(timetable.bells.len(), 3);
        assert_eq!(
            timetable.bells.get(&0),
            Some(&Bell {
                name: "a".to_string(),
                time: 1
            })
        );
        assert_eq!(
            timetable.bells.get(&1),
            Some(&Bell {
                name: "b".to_string(),
                time: 2
            })
        );
        assert_eq!(
            timetable.bells.get(&2),
            Some(&Bell {
                name: "c".to_string(),
                time: 3
            })
        );
    }
}
