use std::collections::HashMap;

pub type BellName = String;
pub type Time = u16;

#[derive(Default, Debug, PartialEq, Eq)]
pub struct Timetable {
    pub version: [u8; 3],
    pub timetable: HashMap<BellName, Time>,
}

impl Timetable {
    pub fn deserialise(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.extend_from_slice(&self.version);
        assert!(self
            .timetable
            .keys()
            .all(|name| name.is_ascii() && u8::try_from(name.bytes().len()).is_ok()));
        let timetable = {
            let mut pairs = self.timetable.iter().collect::<Vec<_>>();
            pairs.sort_unstable_by_key(|(_, time)| **time);
            pairs
        };

        for (name, time) in timetable {
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
        let mut timetable = HashMap::new();
        while bytes.peek().is_some() {
            let name_len = bytes.next().unwrap();
            let name = String::from_utf8(bytes.by_ref().take(name_len.into()).collect()).unwrap();
            let time = u16::from_be_bytes(bytes.next_chunk().unwrap());
            timetable.insert(name, time);
        }
        Self { version, timetable }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deserialise() {
        let mut timetable = Timetable {
            version: [0; 3],
            timetable: HashMap::new(),
        };
        timetable.timetable.insert("a".into(), 1);
        timetable.timetable.insert("b".into(), 2);
        timetable.timetable.insert("c".into(), 3);
        let bytes = timetable.deserialise();
        assert_eq!(bytes, vec![0, 0, 0, 1, 97, 0, 1, 1, 98, 0, 2, 1, 99, 0, 3]);
    }

    #[test]
    fn test_serialise() {
        let bytes = vec![0, 1, 0, 1, 97, 0, 1, 1, 98, 0, 2, 1, 99, 0, 3];
        let timetable = Timetable::serialise(&bytes);
        assert_eq!(timetable.version, [0, 1, 0]);
        assert_eq!(timetable.timetable.len(), 3);
        assert_eq!(timetable.timetable.get("a"), Some(&1));
        assert_eq!(timetable.timetable.get("b"), Some(&2));
        assert_eq!(timetable.timetable.get("c"), Some(&3));
    }
}
